import { useState } from 'react';
import { FaInstagram, FaPinterestP } from 'react-icons/fa';

export default function PhotographyPortfolio() {
  const [entered, setEntered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const photos = [
    {
      image: '/photos/surathkal_morning.jpeg',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Surathkal',
    },
    {
      image: '/photos/summer.jpeg',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jabalpur',
    },
    {
      image: '/photos/coldcold.jpeg',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'UAE',
    },
    {
      image: '/photos/vishu.jpeg',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jabalpur',
    },
    {
      image: '/photos/mirrors.jpeg',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Surathkal',
    },
    {
      image: '/photos/college.jpeg',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jabalpur',
    },
    {
      image: '/photos/water_glisten.jpeg',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jabalpur',
    },
    {
      image: '/photos/fort3.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/fort2.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/fort4.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/fort1.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/fort5.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/fort6.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/jaipur_cow.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/jaipur_man.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/music_man.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/palace.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/palace2.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/palace3.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/palace4.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/people.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/train_me.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/jantar1.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/jantar2.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/marry.JPG',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Jaipur',
    },
    {
      image: '/photos/mumb1.jpg',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Mumbai',
    },
    {
      image: '/photos/mumb4.jpg',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Mumbai',
    },
    {
      image: '/photos/mumb5.jpg',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Mumbai',
    },
    {
      image: '/photos/mumb6.jpg',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Mumbai',
    },
    {
      image: '/photos/mumb7.jpg',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Mumbai',
    },
    {
      image: '/photos/mumb8.jpg',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Mumbai',
    },
    {
      image: '/photos/mumb9.jpg',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Mumbai',
    },
    {
      image: '/photos/mumb10.jpg',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Mumbai',
    },
    {
      image: '/photos/mumb11.jpg',
      ratio: 'aspect-[4/3]',
      camera: 'SONY DSC-W310',
      edit: 'VSCO',
      category: 'Mumbai',
    },
    {
      image: '/photos/nekoneko.jpeg',
      ratio: 'aspect-[4/3]',
      camera: 'Samsung A52s',
      edit: 'VSCO',
      category: 'Jabalpur',
    },
    {
      image: '/photos/fadil.jpeg',
      ratio: 'aspect-[4/3]',
      camera: 'Samsung A52s',
      edit: 'VSCO',
      category: 'Jabalpur',
    },
    {
      image: '/photos/leher.jpeg',
      ratio: 'aspect-[4/3]',
      camera: 'Samsung A52s',
      edit: 'VSCO',
      category: 'Jabalpur',
    },

    {
      image: '/photos/night1.jpg',
      ratio: 'aspect-[4/3]',
      camera: 'iPhone 12',
      edit: 'DazzCam',
      category: 'UAE',
    },
    {
      image: '/photos/night2.jpg',
      ratio: 'aspect-[4/3]',
      camera: 'iPhone 12',
      edit: 'DazzCam',
      category: 'UAE',
    },
    {
      image: '/photos/night3.jpg',
      ratio: 'aspect-[4/3]',
      camera: 'iPhone 12',
      edit: 'DazzCam',
      category: 'UAE',
    },
    {
      image: '/photos/gv2.jpeg',
      ratio: 'aspect-[4/3]',
      camera: 'iPhone 12',
      edit: 'DazzCam',
      category: 'UAE',
    },
    {
      image: '/photos/gv4.jpeg',
      ratio: 'aspect-[4/3]',
      camera: 'iPhone 12',
      edit: 'DazzCam',
      category: 'UAE',
    },
    {
      image: '/photos/gv5.jpeg',
      ratio: 'aspect-[4/3]',
      camera: 'iPhone 12',
      edit: 'DazzCam',
      category: 'UAE',
    },
    {
      image: '/photos/gv3.jpeg',
      ratio: 'aspect-[4/3]',
      camera: 'iPhone 12',
      edit: 'DazzCam',
      category: 'UAE',
    },
    {
      image: '/photos/gv6.jpeg',
      ratio: 'aspect-[4/3]',
      camera: 'iPhone 12',
      edit: 'DazzCam',
      category: 'UAE',
    },
    {
      image: '/photos/gv7.jpeg',
      ratio: 'aspect-[4/3]',
      camera: 'iPhone 12',
      edit: 'DazzCam',
      category: 'UAE',
    },
    {
      image: '/photos/gv8.jpeg',
      ratio: 'aspect-[4/3]',
      camera: 'iPhone 12',
      edit: 'DazzCam',
      category: 'UAE',
    },

  ];

  const categories = ['All', ...new Set(photos.map((photo) => photo.category))];

  const filteredPhotos =
    selectedCategory === 'All'
      ? photos
      : photos.filter((photo) => photo.category === selectedCategory);

  const currentPhoto =
    selectedIndex !== null ? filteredPhotos[selectedIndex] : null;

  const showNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % filteredPhotos.length);
  };

  const showPrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) =>
      prev === 0 ? filteredPhotos.length - 1 : prev - 1
    );
  };

  const PhotoCard = ({ photo, index }) => {
    const rotations = ['-rotate-1', 'rotate-1', 'rotate-0', 'rotate-[0.6deg]'];
    const tilt = rotations[index % rotations.length];

    return (
      <div
        className={`relative bg-[#171717] shadow-lg ${tilt} transition-all duration-300 hover:scale-[1.02] hover:rotate-0 cursor-pointer`}
        onClick={() =>
          setSelectedIndex(
            filteredPhotos.findIndex((p) => p.image === photo.image)
          )
        }
      >
        <div className="relative p-3 bg-[#171717]">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(circle at top, #0f0d0b 5px, transparent 5px) top/18px 10px repeat-x,
                radial-gradient(circle at bottom, #0f0d0b 5px, transparent 5px) bottom/18px 10px repeat-x,
                radial-gradient(circle at left, #0f0d0b 5px, transparent 5px) left/10px 18px repeat-y,
                radial-gradient(circle at right, #0f0d0b 5px, transparent 5px) right/10px 18px repeat-y
              `,
            }}
          />

          <div className="bg-[#111111] relative border border-white/10">
            <img
              src={photo.image}
              alt="photo"
              className={`${photo.ratio} w-full object-cover`}
            />
          </div>
        </div>

        <div className="mt-2 px-2 pb-2 text-[10.3px] uppercase tracking-[0.15em] text-[#fdffdc] leading-relaxed">
          {photo.category} // {photo.camera} // {photo.edit}
        </div>
      </div>
    );
  };

  if (!entered) {
    return (
      <div className="min-h-screen bg-[#0f0d0b] text-[#fdffdc] font-medium flex items-center justify-center px-6">
        <div className="max-w-5xl w-full">
          <p className="uppercase tracking-[0.27em] text-xl mb-8">
            Mishel's Photo Archive
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold leading-[1.2] tracking-[0.12em] uppercase max-w-4xl">
            Collected shards of cities, colors, and memories.
          </h1>

          <div className="mt-16 flex items-center justify-between border-t border-white/10 pt-8">
            <div className="flex items-center gap-4 text-[#d4d4d4]">
              <span className="text-sm tracking-[0.08em] uppercase">
                FIND ME :
              </span>
              <a
                href="https://instagram.com/mishhchievouss"
                target="_blank"
                rel="noreferrer"
                className="opacity-80 hover:opacity-100 text-xl"
              >
                <FaInstagram />
              </a>

              <a
                href="https://pinterest.com/cypruskacapital"
                target="_blank"
                rel="noreferrer"
                className="opacity-80 hover:opacity-100 text-xl"
              >
                <FaPinterestP />
              </a>
            </div>

            <button
              onClick={() => setEntered(true)}
              className="border border-white/15 px-5 py-3 text-sm uppercase tracking-[0.25em] bg-[#171717] hover:bg-[#222]"
            >
              Open Album
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            onClick={showPrev}
            className="absolute left-4 md:left-8 text-2xl md:text-6xl text-white/70"
          >
            ←
          </button>

          <img
            src={currentPhoto.image}
            alt="photo"
            className="max-w-[95vw] max-h-[85vh] object-contain shadow-2xl"
          />

          <button
            onClick={showNext}
            className="absolute right-4 md:right-8 text-2xl md:text-6xl text-white/70"
          >
            →
          </button>
        </div>
      )}

      <div className="min-h-screen bg-[#0f0d0b] text-[#fdffdc] px-4 sm:px-6 md:px-10 py-16">
        <div className="w-full max-w-[1500px] mx-auto">
          <section className="mb-12 flex justify-between items-start gap-6">
            <div>
              <p className="uppercase tracking-[0.22em] text-lg mb-5 text-white/60">
                Travel Stamps
              </p>
              <h2 className="text-3xl md:text-5xl font-semibold uppercase tracking-[0.08em]">
                Curated Places & Visual Notes
              </h2>
            </div>

            <button
              onClick={() => setEntered(false)}
              className="text-sm uppercase tracking-[0.29em] border-b border-white/30"
            >
              BACK
            </button>
          </section>

          <div className="flex gap-3 mb-8 overflow-x-auto pb-2 whitespace-nowrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.21em] border transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-white text-black border-white shadow-sm'
                    : 'border-white/15 bg-[#171717] text-white/80 hover:bg-[#222]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo, i) => (
              <PhotoCard key={photo.image + i} photo={photo} index={i} />
            ))}
          </section>
        </div>
      </div>
    </>
  );
}