import {Product} from "./Product";
import React from "react";
import {IonItem, IonLabel} from "@ionic/react";

interface ProductExt extends Product {
    onEdit: (id?: string) => void;
}

const Item: React.FC<ProductExt> = ({id, name, description, expiration_date, available, onEdit}) => {
    return (
        <IonItem onClick={() => onEdit(id)}>
            <IonLabel>
                {name}
            </IonLabel>
            {/* <IonLabel>
                {description}
            </IonLabel>
            <IonLabel>
                {expiration_date}
            </IonLabel>
            <IonLabel>
                {available}
            </IonLabel> */}
        </IonItem>
    );
};

export default Item;