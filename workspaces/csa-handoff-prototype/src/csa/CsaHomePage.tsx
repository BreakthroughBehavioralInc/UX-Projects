import { CsaPageContainer } from "./CsaPageContainer";
import { CsaSearchWorkspace } from "./CsaSearchWorkspace";

export function CsaHomePage() {
  return (
    <CsaPageContainer>
      <div className="mx-auto w-full max-w-[800px]">
        <CsaSearchWorkspace />
      </div>
    </CsaPageContainer>
  );
}
