// ==UserScript==
// @name         Fudan Graduate Evaluation Auto-Fill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-fill course evaluation forms with "Totally Agree" for Fudan University Graduate Students
// @author       zsy1207
// @match        https://yzsfwapp.fudan.edu.cn/gsapp/sys/wspjappfudan/*
// @icon         https://www.fudan.edu.cn/favicon.ico
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // ===========================================
    // Configuration
    // ===========================================
    const CONFIG = {
        // Delay between operations (ms)
        CLICK_DELAY: 300,
        SUBMIT_DELAY: 500,
        NEXT_COURSE_DELAY: 1000,
        PAGE_LOAD_DELAY: 1500,

        // Auto mode: automatically process all courses
        AUTO_MODE: true,

        // Debug mode: show console logs
        DEBUG: true
    };

    // ===========================================
    // Utility Functions
    // ===========================================
    function log(...args) {
        if (CONFIG.DEBUG) {
            console.log('[FudanEval]', ...args);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const el = document.querySelector(selector);
                if (el) {
                    obs.disconnect();
                    resolve(el);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // ===========================================
    // Core Functions
    // ===========================================

    // Get all unevaluated course cards
    function getUnevaluatedCourses() {
        const unevaluated = [];

        // Method 1: Find by "未评教" text in various container patterns
        const allElements = document.querySelectorAll('*');
        const cardContainers = new Set();

        allElements.forEach(el => {
            if (el.textContent.includes('未评教') && !el.textContent.includes('已评教')) {
                // Find the clickable parent card
                let parent = el.parentElement;
                let maxDepth = 10;
                while (parent && maxDepth > 0) {
                    // Check if this is a clickable card element
                    if (parent.onclick ||
                        parent.classList.contains('pj-card') ||
                        parent.classList.contains('wspj-card') ||
                        parent.classList.contains('course-card') ||
                        parent.getAttribute('data-wid') ||
                        parent.style.cursor === 'pointer') {
                        cardContainers.add(parent);
                        break;
                    }
                    // Check for click event listener
                    if (parent.tagName === 'DIV' && parent.className.includes('card')) {
                        cardContainers.add(parent);
                        break;
                    }
                    parent = parent.parentElement;
                    maxDepth--;
                }
            }
        });

        // Method 2: Find by common class patterns
        const cardSelectors = [
            '.pj-card:not(.pj-card-done)',
            '.wspj-card:not(.done)',
            '.course-item:not(.evaluated)',
            '[class*="card"]:not([class*="done"]):not([class*="finish"])',
            '.bh-card'
        ];

        for (const selector of cardSelectors) {
            try {
                const cards = document.querySelectorAll(selector);
                cards.forEach(card => {
                    if (card.textContent.includes('未评教')) {
                        cardContainers.add(card);
                    }
                });
            } catch (e) {
                // Selector might be invalid
            }
        }

        // Method 3: Find div elements with course info that haven't been evaluated
        const coursePatterns = document.querySelectorAll('div[class*="pj"], div[class*="card"], li[class*="item"]');
        coursePatterns.forEach(el => {
            if (el.textContent.includes('未评教') &&
                el.offsetParent !== null && // Visible
                el.offsetHeight > 30) { // Has reasonable size
                cardContainers.add(el);
            }
        });

        unevaluated.push(...cardContainers);
        log(`Found ${unevaluated.length} unevaluated courses`);
        return unevaluated;
    }

    // Select all "完全同意" (Totally Agree) options
    function selectAllTotallyAgree() {
        let selectedCount = 0;

        // Method 1: Find all labels containing "完全同意" text and click them
        const allLabels = document.querySelectorAll('label');
        const targetLabels = [];

        allLabels.forEach(label => {
            const text = label.textContent.trim();
            if (text === '完全同意') {
                targetLabels.push(label);
            }
        });

        log(`Found ${targetLabels.length} "完全同意" labels`);

        // Click each label
        targetLabels.forEach((label, index) => {
            setTimeout(() => {
                // Find the radio input inside or associated with this label
                const radio = label.querySelector('input[type="radio"]') ||
                             document.getElementById(label.getAttribute('for'));

                if (radio && !radio.checked) {
                    // Trigger click on the label (more reliable for custom styled radios)
                    label.click();
                    selectedCount++;
                    log(`Clicked option ${index + 1}`);
                } else if (!radio) {
                    // If no radio found, just click the label
                    label.click();
                    selectedCount++;
                    log(`Clicked label ${index + 1} (no radio found)`);
                }
            }, index * 50); // Small delay between clicks
        });

        // Method 2: If method 1 didn't work, try finding by class patterns
        if (targetLabels.length === 0) {
            // Try common class patterns for evaluation forms
            const radioInputs = document.querySelectorAll(
                'input[type="radio"][value="100"], ' +
                'input[type="radio"][value="5"], ' +
                'input[type="radio"]:first-of-type'
            );

            radioInputs.forEach(radio => {
                const name = radio.getAttribute('name');
                // Only click if this is the first (highest value) option in its group
                const group = document.querySelectorAll(`input[name="${name}"]`);
                if (group[0] === radio && !radio.checked) {
                    radio.click();
                    selectedCount++;
                }
            });
        }

        // Method 3: Click by ZeroStar rating component if present
        const zeroStarItems = document.querySelectorAll('.zeroStarItem, .star-item');
        if (zeroStarItems.length > 0) {
            zeroStarItems.forEach((item, index) => {
                // Find the highest rating option (usually first or last depending on implementation)
                const stars = item.querySelectorAll('.star, [class*="star"]');
                if (stars.length > 0) {
                    stars[stars.length - 1].click(); // Click highest rating
                    selectedCount++;
                }
            });
        }

        log(`Total selected: ${selectedCount} options`);
        return selectedCount > 0 ? selectedCount : targetLabels.length;
    }

    // Click submit button
    async function submitForm() {
        // Find submit button by multiple selectors
        let submitBtn = null;

        // Try various selectors
        const selectors = [
            'a.bh-btn-primary',
            '.bh-btn-primary',
            'button.bh-btn-primary',
            '.pj-form-footer a:nth-child(2)',
            '.bh-paper-pile-footer a:nth-child(2)'
        ];

        for (const selector of selectors) {
            submitBtn = document.querySelector(selector);
            if (submitBtn && submitBtn.textContent.includes('提交')) {
                break;
            }
            submitBtn = null;
        }

        // Fallback: find by text content
        if (!submitBtn) {
            const allLinks = document.querySelectorAll('a, button');
            submitBtn = Array.from(allLinks).find(el => {
                const text = el.textContent.trim();
                return text === '提交' && el.offsetParent !== null; // Visible element
            });
        }

        if (submitBtn) {
            log('Clicking submit button');
            submitBtn.click();
            await sleep(CONFIG.SUBMIT_DELAY);

            // Handle confirmation dialog if present
            await handleConfirmDialog();
            return true;
        }

        log('Submit button not found');
        return false;
    }

    // Handle confirmation dialog
    async function handleConfirmDialog() {
        // Wait for dialog to appear
        await sleep(500);

        // Try multiple dialog confirm button selectors
        const dialogSelectors = [
            '.layui-layer-btn0',
            '.bh-dialog-btn-confirm',
            '.jconfirm-buttons button:first-child',
            '.swal2-confirm',
            '.modal-footer .btn-primary',
            '.bh-btn-primary'
        ];

        for (const selector of dialogSelectors) {
            const confirmBtn = document.querySelector(selector);
            if (confirmBtn && confirmBtn.offsetParent !== null) {
                log('Clicking confirm button in dialog');
                confirmBtn.click();
                await sleep(500);
                return;
            }
        }

        // Fallback: find by text
        const buttons = document.querySelectorAll('a, button');
        const confirmBtn = Array.from(buttons).find(el => {
            const text = el.textContent.trim();
            return (text === '确定' || text === '确认' || text === 'OK' || text === 'Yes') &&
                   el.offsetParent !== null;
        });

        if (confirmBtn) {
            log('Clicking confirm button (text match)');
            confirmBtn.click();
            await sleep(500);
        }
    }

    // Close current form
    async function closeForm() {
        // Try various close button selectors
        const closeSelectors = [
            '.pj-form-footer a:nth-child(3)',
            '.bh-paper-pile-footer a:last-child',
            '.bh-dialog-close',
            '.layui-layer-close',
            'a.bh-btn-default'
        ];

        for (const selector of closeSelectors) {
            const closeBtn = document.querySelector(selector);
            if (closeBtn && (closeBtn.textContent.includes('关闭') || closeBtn.textContent.includes('Close'))) {
                log('Clicking close button');
                closeBtn.click();
                await sleep(CONFIG.CLICK_DELAY);
                return true;
            }
        }

        // Fallback: find by text
        const closeBtn = Array.from(document.querySelectorAll('a, button')).find(el => {
            return el.textContent.trim() === '关闭' && el.offsetParent !== null;
        });

        if (closeBtn) {
            log('Clicking close button (text match)');
            closeBtn.click();
            await sleep(CONFIG.CLICK_DELAY);
            return true;
        }

        // Try clicking X button in modal header
        const xBtn = document.querySelector('.bh-dialog-close, .close, [class*="close"]');
        if (xBtn) {
            xBtn.click();
            await sleep(CONFIG.CLICK_DELAY);
            return true;
        }

        return false;
    }

    // Process single course evaluation
    async function processSingleCourse() {
        log('Processing current course evaluation form');

        // Wait for form to load
        await sleep(CONFIG.PAGE_LOAD_DELAY);

        // Select all "完全同意"
        const selectedCount = selectAllTotallyAgree();

        if (selectedCount > 0) {
            await sleep(CONFIG.CLICK_DELAY);

            // Submit the form
            const submitted = await submitForm();

            if (submitted) {
                log('Form submitted successfully');
                await sleep(CONFIG.NEXT_COURSE_DELAY);
                return true;
            }
        }

        return false;
    }

    // Process all courses automatically
    async function processAllCourses() {
        log('Starting auto-evaluation process');

        // Wait for page to fully load
        await sleep(CONFIG.PAGE_LOAD_DELAY);

        let processedCount = 0;
        let maxIterations = 50; // Safety limit

        while (maxIterations > 0) {
            maxIterations--;

            // Get unevaluated courses
            const courses = getUnevaluatedCourses();

            if (courses.length === 0) {
                log('All courses have been evaluated!');
                break;
            }

            // Click on first unevaluated course
            log(`Clicking on course: ${courses[0].textContent.substring(0, 50)}...`);
            courses[0].click();

            // Wait for form to open
            await sleep(CONFIG.PAGE_LOAD_DELAY);

            // Process the form
            const success = await processSingleCourse();

            if (success) {
                processedCount++;
                log(`Completed ${processedCount} course(s)`);
            } else {
                log('Failed to process course, stopping');
                break;
            }

            // Small delay before next iteration
            await sleep(CONFIG.NEXT_COURSE_DELAY);
        }

        log(`Auto-evaluation complete! Processed ${processedCount} course(s)`);
        alert(`评教完成！共完成 ${processedCount} 门课程的评教。`);
    }

    // ===========================================
    // UI Controls
    // ===========================================
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'fudan-eval-panel';
        panel.innerHTML = `
            <style>
                #fudan-eval-panel {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    z-index: 99999;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 15px;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    min-width: 200px;
                }
                #fudan-eval-panel h3 {
                    color: white;
                    margin: 0 0 12px 0;
                    font-size: 14px;
                    font-weight: 600;
                    text-align: center;
                }
                #fudan-eval-panel button {
                    display: block;
                    width: 100%;
                    margin: 8px 0;
                    padding: 10px 16px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                #fudan-eval-panel button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                #fudan-eval-panel .btn-primary {
                    background: #ffffff;
                    color: #667eea;
                }
                #fudan-eval-panel .btn-primary:hover {
                    background: #f0f0ff;
                }
                #fudan-eval-panel .btn-secondary {
                    background: rgba(255,255,255,0.2);
                    color: white;
                }
                #fudan-eval-panel .btn-secondary:hover {
                    background: rgba(255,255,255,0.3);
                }
                #fudan-eval-panel .btn-danger {
                    background: #ff6b6b;
                    color: white;
                }
                #fudan-eval-panel .btn-danger:hover {
                    background: #ff5252;
                }
                #fudan-eval-panel .status {
                    color: rgba(255,255,255,0.9);
                    font-size: 11px;
                    text-align: center;
                    margin-top: 8px;
                }
                #fudan-eval-panel .minimize-btn {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.3);
                    color: white;
                    font-size: 12px;
                    line-height: 20px;
                    text-align: center;
                    cursor: pointer;
                }
            </style>
            <div class="minimize-btn" id="minimize-panel">-</div>
            <h3>FD Evaluation Helper</h3>
            <button class="btn-primary" id="btn-fill-all">Fill All (完全同意)</button>
            <button class="btn-primary" id="btn-auto-all">Auto All Courses</button>
            <button class="btn-secondary" id="btn-submit">Submit Current</button>
            <button class="btn-danger" id="btn-close">Close Panel</button>
            <div class="status" id="eval-status">Ready</div>
        `;

        document.body.appendChild(panel);

        // Event listeners
        document.getElementById('btn-fill-all').addEventListener('click', async () => {
            updateStatus('Filling...');
            const count = selectAllTotallyAgree();
            updateStatus(`Filled ${count} options`);
        });

        document.getElementById('btn-auto-all').addEventListener('click', async () => {
            updateStatus('Auto processing...');
            await processAllCourses();
        });

        document.getElementById('btn-submit').addEventListener('click', async () => {
            updateStatus('Submitting...');
            const success = await submitForm();
            updateStatus(success ? 'Submitted!' : 'Submit failed');
        });

        document.getElementById('btn-close').addEventListener('click', () => {
            panel.remove();
        });

        document.getElementById('minimize-panel').addEventListener('click', () => {
            const content = panel.querySelectorAll('button, .status, h3');
            const isMinimized = panel.dataset.minimized === 'true';

            content.forEach(el => {
                el.style.display = isMinimized ? '' : 'none';
            });

            panel.dataset.minimized = isMinimized ? 'false' : 'true';
            document.getElementById('minimize-panel').textContent = isMinimized ? '-' : '+';
            panel.style.minWidth = isMinimized ? '200px' : '50px';
        });
    }

    function updateStatus(text) {
        const status = document.getElementById('eval-status');
        if (status) {
            status.textContent = text;
        }
        log(text);
    }

    // ===========================================
    // Initialize
    // ===========================================
    function init() {
        log('Fudan Evaluation Helper initialized');

        // Wait for page to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(createControlPanel, 1000);
            });
        } else {
            setTimeout(createControlPanel, 1000);
        }
    }

    init();
})();

