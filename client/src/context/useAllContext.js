import { useContext } from "react";
import Context from "./Context";

function useAllContext() {
  return useContext(Context);
}
export default useAllContext;
