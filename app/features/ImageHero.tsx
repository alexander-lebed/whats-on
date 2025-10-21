import { FC } from 'react';
import Image from 'next/image';

type Props = {
  title: string;
  imgUrl: string | null;
};

const ImageHero: FC<Props> = ({ imgUrl, title }) => {
  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: '16 / 9' }}
      >
        {imgUrl ? (
          <>
            {/* Blurred background to avoid black bars while preserving full image in foreground */}
            <Image
              src={imgUrl}
              alt=""
              aria-hidden
              fill
              priority
              className="object-cover blur-2xl scale-110 opacity-40"
              sizes="100vw"
            />
            <Image
              src={imgUrl}
              alt={title}
              fill
              priority
              className="object-contain"
              sizes="100vw"
            />
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-stone-400 text-background">
            {title}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageHero;
