import Seed from "../../components/Seed";

const Page = () => {
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold text-center">오늘의 씨</h1>
      <Seed 
  scriptures={["성구 1", "성구 2", "성구 3"]}
  cardImages={["/images/conduction.jpg", "/images/courage.jpg", "/images/wish.jpg"]}
  backImages={["/images/conductionBack.jpg", "/images/courageBack.jpg","/images/wishBack.jpg"]}
/>


    </div>
  );
};

export default Page;
