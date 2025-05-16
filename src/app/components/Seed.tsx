'use client';

import { useState } from 'react';

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
        <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
            {/* 카드 선택 UI */}
            {cardsVisible && selectedCard === null && (
                <div className="flex gap-6 mt-8 animate-float relative">
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
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center text-gray-700 font-semibold animate-bounce">
                        선택해주세요
                    </div>
                </div>
            )}

            {/* 선택된 카드 */}
            {selectedCard !== null && showCard && (
                <div
                    className="absolute top-1/2 left-1/2 w-[250px] h-[400px] -translate-x-1/2 -translate-y-1/2 perspective"
                    onClick={handleCardFlip}
                >
                    <div
                        className={`relative w-full h-full transition-transform duration-1000 transform-style preserve-3d ${
                            flipped ? 'rotate-y-180' : ''
                        } animate-spinOnce`}
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

                    {/* 클릭 유도 */}
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
