import * as tmp from "react-router";
import { useUpdate } from "ahooks";
import { useMemo, useRef } from "react";
import { parse, stringify } from "query-string";
console.log(parse);
const rc = tmp as any;
const baseParseConfig = {
  parseNumbers: false,
  parseBoolean: false,
};

const baseStringifyConfig = {
  skipNull: false,
  skipEmptyString: false,
};
const useUrlState = (initialState: any, options: any) => {
  const {
    navigateMode = "push",
    parseOptions,
    stringfyOptions,
  } = options || {};

  const mergedParseOptions = {
    ...baseParseConfig,
    ...parseOptions,
  };
  const mergedStringfyOptions = {
    ...baseStringifyConfig,
    stringfyOptions,
  };
  const location = rc.useLocation();
  //   v5
  const history = rc.useHistory?.();
  //   v6
  const navigate = rc.useNavigate?.();
  const update = useUpdate();

  const initialStateRef = useRef(
    typeof initialState === "function" ? initialState() : initialState || {}
  );
  const queryFromUrl = useMemo(() => {
    return parse(location.search, mergedParseOptions);
  }, [location.search]);
  //   const targetQuery = useMemo(
  //     ()=>({
  //         ...initialStateRef.current,
  //     })
  //   )
};
export default useUrlState;
