import PromotionOnAppForm from "./PromotionOnAppForm/PromotionOnAppForm";
import { useState } from "react";

const PromotionOnAppDetail = () => {
    const [detail, setDetail] = useState(null);
    return (
        <PromotionOnAppForm detail={detail}/>
    )
}

export default PromotionOnAppDetail;