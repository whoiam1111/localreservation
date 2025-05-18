'use client';

import { useState, useEffect } from 'react';

interface Scripture {
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
}

interface SeedProps {
    scriptures: Scripture[];
    cardImages: string[];
    backImages: string[];
}

const Seed: React.FC<SeedProps> = ({ scriptures, cardImages, backImages }) => {
    const [selectedCard, setSelectedCard] = useState<number | null>(null);
    const [cardsVisible, setCardsVisible] = useState(true);
    const [flipped, setFlipped] = useState(false);
    const [showCard, setShowCard] = useState(false);

    // 👉 Body 스크롤 방지
    useEffect(() => {
        if (selectedCard !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [selectedCard]);

    const handleCardClick = (index: number) => {
        setSelectedCard(index);
        setCardsVisible(false);
        setFlipped(false);
        setTimeout(() => setShowCard(true), 100);
    };

    const handleCardFlip = () => {
        setFlipped((prev) => !prev);
    };

    return (
        <div className="w-full h-[80vh] overflow-hidden flex items-center justify-center relative">
            {/* 카드 선택 UI */}
            {cardsVisible && selectedCard === null && (
                <div className="flex flex-col items-center justify-center animate-float">
                    <div className="flex gap-6">
                        {cardImages.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => handleCardClick(index)}
                                className="transition-all duration-500 transform scale-100 opacity-100 cursor-pointer"
                                style={{
                                    width: '150px',
                                    height: '230px',
                                    backgroundImage: `url(${image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: '10px',
                                }}
                            />
                        ))}
                    </div>
                    <div className="mt-6 text-center text-gray-700 font-semibold animate-bounce">
                        선택해주세요
                    </div>
                </div>
            )}

            {/* 선택된 카드 */}
            {selectedCard !== null && showCard && (
  <div
    className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50"
  >
    <div
      className={`relative w-[250px] h-[400px] perspective transition-transform duration-1000 transform-style preserve-3d ${
        flipped ? 'rotate-y-180' : ''
      } animate-spinOnce`}
      onClick={handleCardFlip} // 👉 클릭 이벤트를 카드에만 걸기
    >
      {/* 앞면 */}
      <div
        className="absolute w-full h-full backface-hidden rounded-xl shadow-xl"
        style={{
          backgroundImage: `url(${cardImages[selectedCard]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* 뒷면 */}
      <div
        className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center rounded-xl"
        style={{
          backgroundImage: `url(${backImages[selectedCard]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="p-4 text-black text-base font-medium leading-relaxed max-w-[80%] text-center font-sans whitespace-pre-line">
          <div className="text-lg font-semibold">
            {scriptures[selectedCard].book_name} {scriptures[selectedCard].chapter}:
            {scriptures[selectedCard].verse}
          </div>
          <div className="my-2" />
          <div>{scriptures[selectedCard].text}</div>
        </div>
      </div>
    </div>

    {/* 클릭 유도 텍스트 */}
    <div className="absolute top-[calc(50%+220px)] left-1/2 transform -translate-x-1/2 mt-2 text-center animate-bounce z-10">
      <div className="text-2xl">↑</div>
      <div className="text-sm text-gray-700 font-semibold">click</div>
    </div>
  </div>
)}

        </div>
    );
};

export default Seed;
