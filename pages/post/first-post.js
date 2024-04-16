import Link from 'next/link';

export default function FirstPost() {
    return (
        <>
            <h1>First Post</h1>
            <Link href='/conway'>Conway's game of life</Link>
        </>
    );
}
