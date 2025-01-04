import useIsBrowser from '@docusaurus/useIsBrowser';
import React, { useEffect } from 'react';
import { triggerTrackingEvent } from '../components/trigger-event';

// Default implementation, that you can customize
export default function Root({ children }) {
    const isBrowser = useIsBrowser();
    useEffect(() => {
        if (!isBrowser) {
            return;
        }

        // addCommunityChatButton();

        setTimeout(() => {
            startAnalytics();
            addCallToActionButton();
            triggerClickEventWhenFromCode();
        }, 0);

    });
    return <>{children}</>;
}


function addCallToActionButton() {

    // do only show on docs-pages, not on landingpages like premium or consulting page.
    if (!location.pathname.includes('.html')) {
        return;
    }

    const callToActions = [
        {
            text: 'Follow',
            keyword: '@twitter',
            url: 'https://twitter.com/intent/user?screen_name=rxdbjs',
            icon: '🐦'
        },
        {
            text: 'Follow',
            keyword: '@LinkedIn',
            url: 'https://www.linkedin.com/company/rxdb',
            icon: '[in]'
        },
        {
            text: 'Follow',
            keyword: '@LinkedIn',
            url: 'https://www.linkedin.com/in/danielmeyerdev/',
            icon: '[in]'
        },
        {
            text: 'Chat',
            keyword: '@discord',
            url: 'https://rxdb.info/chat',
            icon: '💬'
        },
        {
            text: 'Star',
            keyword: '@github',
            url: 'https://rxdb.info/code',
            icon: '🐙💻'
        },
        {
            text: 'Subscribe',
            keyword: '@newsletter',
            url: 'https://rxdb.info/newsletter',
            icon: '📰'
        },
        // {
        //     text: 'Take Part in the',
        //     keyword: 'User Survey 2024',
        //     url: 'https://rxdb.info/survey',
        //     icon: '📝'
        // }
    ];
    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    const callToActionButtonId = 'rxdb-call-to-action-button';
    function setCallToActionOnce() {
        console.log('set call to action button');

        const tenMinutes = 1000 * 60 * 10;
        const now = Date.now();
        const timeSlot = (now - (now % tenMinutes)) / tenMinutes;
        console.log('timeslot ' + timeSlot);
        const randId = timeSlot % callToActions.length;
        console.log('randid: ' + randId);
        const callToAction = callToActions[randId];
        const alreadyThere = document.querySelector('.call-to-action');
        if (alreadyThere) {
            alreadyThere.parentNode.removeChild(alreadyThere);
        }


        const positionReferenceElement = document.querySelector('.navbar__items');
        if (!positionReferenceElement) {
            // not loaded yet!
            return;
        }

        const newElementWrapper = document.createElement('div');
        newElementWrapper.classList.add('call-to-action');

        const newElement = document.createElement('a');
        newElement.onclick = () => {
            triggerTrackingEvent('call-to-action', 0.35, false);
        };
        newElement.classList.add('hover-shadow-top');
        newElement.id = callToActionButtonId;
        newElement.innerHTML = callToAction.text + ' <b class="call-to-action-keyword">' + callToAction.keyword + '</b>' +
            '<b class="call-to-action-icon">' + callToAction.icon + '</b>';
        newElement.href = callToAction.url;
        newElement.target = '_blank';
        newElementWrapper.append(newElement);


        insertAfter(positionReferenceElement, newElementWrapper);
    }
    setCallToActionOnce();
}

/**
 * There are some logs that RxDB prints out to the console of the developers.
 * These logs can contain links with the query param ?console=foobar
 * which allows us to detect that a user has really installed and started RxDB.
 */
function triggerClickEventWhenFromCode() {
    const TRIGGER_CONSOLE_EVENT_ID = 'console-log-click';
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('console')) {
        return;
    }
    triggerTrackingEvent(TRIGGER_CONSOLE_EVENT_ID + '_' + urlParams.get('console'), 10, false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addCommunityChatButton() {
    const chatButtonId = 'fixed-chat-button';
    const elementExists = document.getElementById(chatButtonId);
    if (elementExists) {
        return;
    }

    const elemDiv = document.createElement('a');
    elemDiv.id = chatButtonId;
    elemDiv.href = '/chat';
    elemDiv.target = '_blank';
    elemDiv.innerHTML = '💬 Community Chat';

    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = '#' + chatButtonId + ' {' +
        'color: white;' +
        'position: fixed;' +
        'right: 0;' +
        'bottom: 0;' +
        'background-color: var(--color-top);' +
        'padding-left: 14px;' +
        'padding-right: 14px;' +
        'padding-top: 2px;' +
        'padding-bottom: 2px;' +
        'text-align: center;' +
        'margin-right: 0px;' +
        'font-weight: bold;' +
        'border-top-left-radius: 9px;' +
        'border-top-right-radius: 9px;' +
        'z-index: 11;' +
        '}' +
        '#fixed-chat-button:hover {' +
        'box-shadow: 2px 2px 13px #ca007c, -2px -1px 14px #ff009e;' +
        'text-decoration: underline;' +
        '}'
        ;
    document.head.appendChild(styleSheet);
    document.body.appendChild(elemDiv);
}



function startAnalytics() {
    console.log('load analytics code');

    setTimeout(function () {
        triggerTrackingEvent('spend_20_seconds_on_page', 0.01, false);
    }, 20 * 1000);
    setTimeout(function () {
        triggerTrackingEvent('spend_60_seconds_on_page', 0.03, false);
    }, 60 * 1000);

    // detect scroll to bottom of landingpage
    let scrollTriggerDone = false;
    let nextScrollTimestamp = 0;
    if (location.pathname === '/' || location.pathname.includes('/sem/')) {
        window.addEventListener('scroll', (event) => {
            const newTimestamp = event.timeStamp;
            if (!scrollTriggerDone && nextScrollTimestamp < newTimestamp) {
                nextScrollTimestamp = newTimestamp + 250;
            } else {
                return;
            }
            /**
             * @link https://fjolt.com/article/javascript-check-if-user-scrolled-to-bottom
             */
            const documentHeight = document.body.scrollHeight;
            const currentScroll = window.scrollY + window.innerHeight;
            // When the user is [modifier]px from the bottom, fire the event.
            const modifier = 800;
            if (currentScroll + modifier > documentHeight) {
                console.log('You are at the bottom!');
                scrollTriggerDone = true;
                triggerTrackingEvent('scroll_to_bottom', 0.12, false);
            }
        });
    }


    // track dev_mode_tracking_iframe event
    const DEV_MODE_EVENT_ID = 'dev_mode_tracking_iframe';
    function checkDevModeEvent() {
        const hasCookie = document.cookie
            .split(';')
            .map(str => str.trim())
            .find(v => v.startsWith(DEV_MODE_EVENT_ID));
        if (!hasCookie) {
            console.log(DEV_MODE_EVENT_ID + ': no cookie');
            return;
        }
        const version = hasCookie.split('=')[1];
        const storageKey = DEV_MODE_EVENT_ID + '=' + version;
        if (localStorage.getItem(storageKey)) {
            console.log(DEV_MODE_EVENT_ID + ': tracked already');
            return;
        }

        console.log(DEV_MODE_EVENT_ID + ': track me version ' + version);
        localStorage.setItem(storageKey, '1');
        triggerTrackingEvent(DEV_MODE_EVENT_ID, 10, true);
        triggerTrackingEvent(DEV_MODE_EVENT_ID + '_' + version, 10, true);
    }
    checkDevModeEvent();
    // also listen for upcoming events 
    // DISABLED because it kill the google metric "Page prevented back/forward cache restoration"
    // const bc = new BroadcastChannel(DEV_MODE_EVENT_ID);
    // bc.onmessage = () => checkDevModeEvent();
    // /track dev_mode_tracking_iframe event

    // reddit pixel
    // @ts-ignore eslint-disable-next-line
    (function (w, d) {
        if (!(w as any).rdt) {
            // @ts-ignore
            const p: any = w.rdt = function () {
                // @ts-ignore
                if (p.sendEvent) {
                    p.sendEvent.apply(p, arguments);
                } else {
                    p.callQueue.push(arguments);
                }
            };
            p.callQueue = [];
            const t = d.createElement('script');
            t.src = 'https://www.redditstatic.com/ads/pixel.js';
            t.async = true;
            const s = d.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(t, s);
        }
    })(window, document);
    (window as any).rdt('init', 't2_131k54', {
        'aaid': '<AAID-HERE>', 'email': '<EMAIL-HERE>', 'externalId': '<EXTERNAL-ID-HERE>', 'idfa': '<IDFA-HERE>'
    });
    (window as any).rdt('track', 'PageVisit');
    // /reddit pixel



    // pipedrive chat
    (window as any).pipedriveLeadboosterConfig = {
        base: 'leadbooster-chat.pipedrive.com', companyId: 11404711, playbookUuid:
            '16a8caba-6b26-4bb1-a1fa-434c4171d542', version: 2
    }; (function () {
        const w = window; if ((w as any).LeadBooster) {
            console.warn('LeadBooster already exists');
        } else {
            (w as any).LeadBooster = {
                q: [], on: function (n, h) {
                    this.q.push({ t: 'o', n: n, h: h });
                }, trigger: function (n) {
                    this.q.push({ t: 't', n: n });
                },
            };
        }
    })();
    // /pipedrive chat





    // function parseQueryParams(url) {
    //     const urlSearchParams = new URL(url).searchParams;
    //     const queryParams = Object.fromEntries(urlSearchParams.entries());
    //     return queryParams;
    // }

    /**
     * History hack,
     * show landingpage on back from somewhere else.
     */
    // function historyHack() {
    //     console.log('document.referrer: ' + document.referrer);
    //     console.log(' window.location.hostname: ' + window.location.hostname);
    //     const reloadWait = 100;
    //     const queryParamFlag = 'history-back';
    //     const originalUrl = location.href;
    //     const queryParams = parseQueryParams(window.location);
    //     let prePopstateUrl = location.href;
    //     window.addEventListener('popstate', function (_event) {
    //         const from = prePopstateUrl;
    //         const to = location.href;
    //         // console.log('from : ' + from);
    //         // console.log('to : ' + to);
    //         prePopstateUrl = location.href;

    //         if (
    //             parseQueryParams(from)[queryParamFlag] &&
    //             document.referrer &&
    //             parseQueryParams(document.referrer)[queryParamFlag]
    //         ) {
    //             return;
    //         }

    //         if (
    //             new URL(from).pathname === '/' &&
    //             parseQueryParams(to)[queryParamFlag]
    //         ) {
    //             history.forward();
    //             setTimeout(() => {
    //                 location.reload();
    //             }, reloadWait);
    //             return;
    //         }

    //         if (
    //             new URL(from).pathname === new URL(to).pathname
    //         ) {
    //             return;
    //         }

    //         setTimeout(() => {
    //             location.reload();
    //         }, reloadWait);
    //     }, {
    //         passive: true
    //     });


    //     if (queryParams[queryParamFlag]) {
    //         history.back();
    //         setTimeout(function () {
    //             history.replaceState(null, document.title, '/');
    //         }, 200);
    //     } else if (
    //         document.referrer &&
    //         new URL(document.referrer).hostname !== window.location.hostname &&
    //         location.pathname !== '/'
    //     ) {
    //         history.pushState(null, document.title, '/?' + queryParamFlag + '=true');
    //         history.pushState(null, document.title, originalUrl);
    //     }
    // }
    // historyHack();



}
