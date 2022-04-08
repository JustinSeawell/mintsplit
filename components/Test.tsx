import { useRouter } from "next/dist/client/router";
import useCollectionData from "../hooks/useCollectionData";

function Test() {
  const router = useRouter();
  const { cid } = router.query;
  const contractAddress = cid as string;
  const { data: collectionData } = useCollectionData(contractAddress);

  console.log("2", { collectionData });

  return <div>test</div>;
}

export default Test;
