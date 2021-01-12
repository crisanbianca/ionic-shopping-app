import React, { useState } from "react";
import {
  IonButton,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { ItemProps } from "./ProductProps";
import { Modal } from "../animations/Modal";

interface ItemPropsExt extends ItemProps {
  onEdit: (_id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ _id, name, description, expiration_date, onEdit, photoPath }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <IonItem>
      <IonLabel  onClick={() => onEdit(_id)}>{name}</IonLabel>
      <IonButton onClick={() => {setShowModal(true); console.log("button clicked")}}>Details</IonButton>
      <Modal open={showModal} description={description} expiration_date={expiration_date} showModal={setShowModal}/>
      <img src={photoPath} style={{ height: 50 }} />
    </IonItem>
  );
};

export default Item;
