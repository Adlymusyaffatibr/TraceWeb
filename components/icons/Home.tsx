import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

export default function Home(props: Props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12.5 17.5V10.8333C12.5 10.3731 12.1269 10 11.6667 10H8.33333C7.8731 10 7.5 10.3731 7.5 10.8333V17.5"
                stroke="#AAAFB2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M2.5 8.33308C2.49988 7.84235 2.71603 7.37651 3.09083 7.05975L8.92417 2.05975C9.54532 1.53477 10.4547 1.53477 11.0758 2.05975L16.9092 7.05975C17.284 7.37651 17.5001 7.84235 17.5 8.33308V15.8331C17.5 16.7536 16.7538 17.4997 15.8333 17.4997H4.16667C3.24619 17.4997 2.5 16.7536 2.5 15.8331V8.33308"
                stroke="#AAAFB2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
