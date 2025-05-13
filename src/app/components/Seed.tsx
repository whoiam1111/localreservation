"use client";

import { useState } from "react";

interface SeedProps {
  scriptures: string[];
  cardImages: string[];
  backImages: string[];
}

const Seed: React.FC<SeedProps> = ({ scriptures, cardImages, backImages }) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showCard, setShowCard] = useState(false); // 카드 보여주기 트리거

  const handleButtonClick = () => {
    setCardsVisible(true);
  };

  const handleCardClick = (index: number) => {
    setSelectedCard(index);
    setCardsVisible(false);
    setFlipped(false);
    setTimeout(() => setShowCard(true), 100); // 살짝 딜레이 주기
  };

  const handleCardFlip = () => {
    setFlipped((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {!selectedCard && !cardsVisible && (
        <div
        onClick={handleButtonClick}
        className="relative w-28 h-28 rounded-full bg-white shadow-[0_10px_20px_rgba(0,0,0,0.3)] 
                   cursor-pointer flex items-center justify-center transition-all duration-300 ease-out 
                   hover:scale-110 active:scale-95 group animate-wiggle"
      >
        {/* 네잎클로버 아이콘 */}
        <div className="text-white text-5xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] group-hover:animate-pulse">
          🍀
        </div>
      
        {/* 중심 반짝임 */}
        <div className="absolute w-3 h-3 top-4 left-4 bg-white rounded-full opacity-30 group-hover:opacity-60 blur-md" />
        <div className="absolute w-2 h-2 bottom-6 right-6 bg-white rounded-full opacity-20 group-hover:opacity-50 blur-sm" />
      
        {/* 라이트 링 효과 */}
        <div className="absolute inset-0 rounded-full border-2 border-white border-opacity-10 group-hover:border-opacity-30 transition-opacity" />
      </div>
      
      
      )}

      {cardsVisible && !selectedCard && (
        <div className="flex gap-6 mt-8 animate-float relative">
          {cardImages.map((image, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(index)}
              className="transition-all duration-500 transform scale-100 opacity-100 cursor-pointer"
              style={{
                width: "150px",
                height: "230px",
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "10px",
              }}
            />
          ))}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center text-gray-700 font-semibold animate-bounce">
            선택해주세요
            </div>
        </div>
      )}

      {selectedCard !== null && showCard && (
        <div
          className="absolute top-1/2 left-1/2 w-[250px] h-[400px] -translate-x-1/2 -translate-y-1/2 perspective"
          onClick={handleCardFlip}
        >
          <div
            className={`relative w-full h-full transition-transform duration-1000 transform-style preserve-3d ${
              flipped ? "rotate-y-180" : ""
            } animate-spinOnce`}
          >
            {/* 앞면 */}
            <div
              className="absolute w-full h-full backface-hidden rounded-xl shadow-xl"
              style={{
                backgroundImage: `url(${cardImages[selectedCard]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* 뒷면 */}
            <div
                className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center rounded-xl shadow-xl"
                style={{
                    backgroundImage: `url(${backImages[selectedCard]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    color: "white",
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.125rem",
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // 뒷면 이미지가 어두울 경우 가독성 향상
                }}
            >
                {scriptures[selectedCard]}
            </div>
          </div>
          {/* 클릭 유도 문구 */}
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

