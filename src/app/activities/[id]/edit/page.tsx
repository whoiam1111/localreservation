import EditActivityClient from '@/app/components/EditActivityClient';

type PageParams = { id: string };

const Page = ({ params }: { params: PageParams }) => {
    const { id } = params;

    return (
        <div>
            <EditActivityClient activityId={id} />
        </div>
    );
};

export default Page;
