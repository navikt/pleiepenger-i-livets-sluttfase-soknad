import * as React from 'react';

function VeilederLokal({ mood }: { mood: 'happy' | 'uncertain' }) {
    return (
        <svg width={49} height={85} viewBox="0 0 49 85" focusable="false">
            <title>{'Group 2'}</title>
            <g fillRule="nonzero" fill="none">
                <path
                    d="M24.7 57.9c4.7 0 8.6-4.2 8.9-8.3v-2.2c3.9-2.8 7-6.4 8.5-12h.3c1 0 1.8-1 1.8-2.2v-6.7c0-.9-.4-1.6-1.1-2-.8-12.3-8.8-22-18.5-22-9.8 0-17.7 9.8-18.6 22.3-.5.4-.9 1.1-.9 1.9v6.7c0 1.2.8 2.2 1.8 2.2h.2c1.6 5.6 4.7 9.6 8.8 11.9l-.1 1.9c0 4.1 4 8.5 8.9 8.5z"
                    fill="#E7E5E2"
                />
                <path
                    d="M15.1 46.9c-3.5.3-5.5.7-7.3 1.2 0 0-5.8-8-5.2-23 0 0 2.1-25.1 22-24.9 19.9.2 21.6 21.3 21.6 21.3 1.5 6.5.1 18.1-3.9 26.8-1.8-.8-4.2-2.4-7.1-2-.2 0-.3-.2-.1-.3 2.7-1.9 5.7-7.2 7-11.8.2.1.4.2.6.2.8 0 1.4-.7 1.4-1.5v-6.2c0-.7-.5-1.3-1.1-1.5-.2-3.5-3.6-3.8-5.3-3.8-.6 0-26.5.1-26.8.1 0 0-4.3-.7-4.6 3.8-.5.2-.9.8-.9 1.4v6.2c0 .8.6 1.5 1.4 1.5.2 0 .3 0 .5-.1 1.4 5.4 3.7 10 7.8 12.6"
                    fill="#8C6026"
                />
                <path
                    d="M48.7 65.5c0-3.6-2.5-8.3-5.6-11.4-3.1-3.1-6.9-5-9.5-5.7-.1 4.3-4 8.6-8.9 8.6s-8.8-4.4-8.9-8.7c-2.5.6-6.4 2.6-9.6 5.8C3.1 57.2.7 61.9.7 65.5v12.4c7.1 4.1 15.3 6.4 24 6.4s16.9-2.4 24-6.4V65.5z"
                    fill="#127A39"
                />
                <path
                    d="M17.3 31.4c-1.3.1-1.6-1.8-1.2-3.1.1-.2.5-1.3 1.2-1.3s1.1.6 1.1.7c.5 1.2.3 3.6-1.1 3.7M31.5 31.4c1.3.1 1.6-1.8 1.2-3.1 0-.3-.4-1.3-1.2-1.3-.7 0-1.1.6-1.1.7-.6 1.2-.3 3.6 1.1 3.7"
                    fill="#645F5A"
                />
                <path
                    d="M24.8,33.6 C25.5,33.5 26,33.6 26.2,33.8 C26.9,34.6 26.6,35.5 25.5,36.2 C24.9,36.6 24.1,36.7 23.7,36.5 C23.5,36.4 23.2,36.5 23.1,36.7 C23,36.9 23.1,37.2 23.3,37.3 C24,37.6 25.1,37.4 25.9,36.9 C27.4,35.9 27.8,34.5 26.8,33.2 C26.4,32.7 25.6,32.6 24.6,32.7 C24.4,32.7 24.2,33 24.2,33.2 C24.4,33.5 24.6,33.7 24.8,33.6 Z"
                    id="nose"
                    fill="#5A524C"
                />
                {mood === 'happy' && (
                    <path
                        d="M29.8,40.2 C29.8,40.3 29.7,40.5 29.5,40.7 C29.3,41.1 29,41.5 28.6,41.8 C27.5,42.9 26.1,43.5 24.4,43.4 C22.7,43.3 21.3,42.7 20.2,41.8 C19.8,41.4 19.5,41.1 19.2,40.7 C19,40.5 18.9,40.3 18.9,40.2 C18.8,40 18.5,39.9 18.3,40 C18.1,40.1 18,40.4 18.1,40.6 C18.2,40.7 18.3,40.9 18.5,41.2 C18.8,41.6 19.2,42.1 19.6,42.5 C20.8,43.6 22.4,44.3 24.3,44.3 C26.3,44.4 27.9,43.7 29.1,42.5 C29.5,42.1 29.8,41.7 30.1,41.2 C30.3,40.9 30.4,40.7 30.4,40.6 C30.5,40.4 30.4,40.1 30.2,40 C30.2,39.9 29.9,40 29.8,40.2 Z"
                        id="mouth_blid"
                        fill="#5A524C"
                    />
                )}
                {mood === 'uncertain' && (
                    <path
                        d="M28.9472705,42.3611203 C28.8452756,42.1729798 28.6473927,41.916164 28.3376803,41.6638179 C27.7676362,41.1993599 27.0303609,40.9452056 26.1296682,41.009985 L24.393371,41.1357849 C24.160106,41.1526857 23.9844748,41.3587604 24.0010878,41.5960658 C24.0177009,41.833371 24.2202671,42.0120442 24.4535322,41.9951435 L26.1896098,41.8693593 C26.8698076,41.8204384 27.3991449,42.0029121 27.8082824,42.3362674 C28.0224352,42.5107539 28.1534373,42.6807706 28.2057057,42.7771851 C28.3186427,42.9855094 28.5762012,43.0612504 28.7809787,42.9463572 C28.9857561,42.8314641 29.0602076,42.5694446 28.9472705,42.3611203 Z"
                        id="mouth_uncertain"
                        fill="#5A524C"
                    />
                )}
            </g>
        </svg>
    );
}

export default VeilederLokal;