import { useSearchParams } from "react-router-dom";
const ShowProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  console.log("params id = ", id);
  return <div>Showoneproduct id = {id} </div>;
};

export default ShowProduct;
