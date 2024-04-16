import Link from 'next/link';
import Image from 'next/image';

export default function Conway() {
    function Conway_Image() {
        return (
            <Image
                src='/conway_img.png' // Route of the image file
                height={144} // Desired size with correct aspect ratio
                width={144} // Desired size with correct aspect ratio
                alt='Conway Image'
            />
        );
    }
    return (
        <>
            <h1>This is conways game of life</h1>
            <div className='bg-black text-white flex flex-col'>
                <Link href='/post/first-post'>Here you go to the first post</Link>
                <Conway_Image />
                <Conway_Image />
            </div>
        </>
    );
}
