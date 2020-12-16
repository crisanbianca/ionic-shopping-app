import React from "react";
import {
  IonItem,
  IonLabel,
} from "@ionic/react";
import { ItemProps } from "./ProductProps";

interface ItemPropsExt extends ItemProps {
  onEdit: (_id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ _id, name, onEdit, photoPath }) => {
  return (
    <IonItem onClick={() => onEdit(_id)}>
      <IonLabel>{name}</IonLabel>
      <img src={photoPath} style={{ height: 50 }} />
    </IonItem>
  );
};

export default Item;
