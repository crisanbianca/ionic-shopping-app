import React, { useContext, useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCheckbox,
  IonLabel,
  IonItem,
  IonDatetime,
  IonFab,
  IonFabButton,
  IonIcon,
  IonActionSheet,
  createAnimation,
} from "@ionic/react";
import { camera, trash, close } from "ionicons/icons";
import { getLogger } from "../core";
import { ProductContext } from "./ProductProvider";
import { RouteComponentProps } from "react-router";
import { ItemProps } from "./ProductProps";
import { useNetwork } from "../utils/useNetwork";
import { Photo, usePhotoGallery } from "../utils/usePhotoGallery";
import { MyMap } from "../utils/MyMap";
// const log = getLogger("ItemEdit");

interface ProductEditProps
  extends RouteComponentProps<{
    id?: string;
  }> {}

const ProductEdit: React.FC<ProductEditProps> = ({ history, match }) => {
  const {
    items,
    saving,
    savingError,
    saveItem,
    deleteItem,
    getServerItem,
    oldItem,
  } = useContext(ProductContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [available, setAvailable] = useState(false);
  const [expiration_date, setExpirationDate] = useState("");
  const [photoPath, setPhotoPath] = useState("");
  const [latitude, setLatitude] = useState(46.7533824);
  const [longitude, setLongitude] = useState(23.5831296);
  const [item, setItem] = useState<ItemProps>();
  const [itemV2, setItemV2] = useState<ItemProps>();
  const { networkStatus } = useNetwork();

  const { photos, takePhoto, deletePhoto } = usePhotoGallery();
  const [photoToDelete, setPhotoToDelete] = useState<Photo>();
  useEffect(() => {
    const routeId = match.params.id || "";
    const item = items?.find((it) => it._id === routeId);
    setItem(item);
    if (item) {
      setName(item.name);
      setDescription(item.description);
      setAvailable(item.available);
      setExpirationDate(item.expiration_date);
      setPhotoPath(item.photoPath);
      if (item.latitude) setLatitude(item.latitude);
      if (item.longitude) setLongitude(item.longitude);
      getServerItem && getServerItem(match.params.id!, item?.version);
    }
  }, [match.params.id, items, getServerItem]);
  useEffect(() => {
    setItemV2(oldItem);
    // log("SET OLD ITEM: " + JSON.stringify(oldItem));
  }, [oldItem]);
  // log("intra");
  const handleSave = () => {
    const editedItem = item
      ? {
          ...item,
          name,
          description,
          expiration_date,
          available,
          status: 0,
          version: item.version ? item.version + 1 : 1,
          photoPath,
          latitude,
          longitude
        }
      : {
          name,
          description,
          expiration_date,
          available,
          status: 0,
          version: 1,
          photoPath,
          latitude,
          longitude
          
        };
    saveItem &&
      saveItem(editedItem, networkStatus.connected).then(() => {
        // log(JSON.stringify(itemV2));
        if (itemV2 === undefined) history.goBack();
      });
  };
  const handleConflict1 = () => {
    if (oldItem) {
      const editedItem = {
        ...item,
        name,
        description,
        expiration_date,
        available,
        status: 0,
        version: oldItem?.version + 1,
        photoPath,
        latitude,
        longitude
      };
      saveItem &&
        saveItem(editedItem, networkStatus.connected).then(() => {
          history.goBack();
        });
    }
  };
  const handleConflict2 = () => {
    if (oldItem) {
      const editedItem = {
        ...item,
        name: oldItem?.name,
        description: oldItem?.description,
        expiration_date: oldItem?.expiration_date,
        available: oldItem?.available,
        status: oldItem?.status,
        version: oldItem?.version + 1,
        photoPath,
        latitude,
        longitude
      };
      saveItem &&
        editedItem &&
        saveItem(editedItem, networkStatus.connected).then(() => {
          history.goBack();
        });
    }
  };
  const handleDelete = () => {
    const editedItem = item
      ? {
          ...item,
          name,
          description,
          expiration_date,
          available,
          status: 0,
          version: 0,
          photoPath,
          latitude,
          longitude
        }
      : {
          name,
          description,
          expiration_date,
          available,
          status: 0,
          version: 0,
          photoPath,
          latitude,
          longitude
        };
    deleteItem &&
      deleteItem(editedItem, networkStatus.connected).then(() =>
        history.goBack()
      );
  };
  useEffect(() => {
    async function groupedAnimation() {
        const saveButtonAnimation = createAnimation()
            .addElement(document.getElementsByClassName("button-save")[0])
            .duration(1000)
            .direction('alternate')
            .iterations(Infinity)
            .keyframes([
                {offset: 0, opacity: '0.6', transform: 'scale(0.7)'},
                {offset: 1, opacity: '0.99', transform: 'scale(1)'}
            ])

        const deleteButtonAnimation = createAnimation()
            .addElement(document.getElementsByClassName("button-delete")[0])
            .duration(1000)
            .direction('alternate')
            .iterations(Infinity)
            .keyframes([
                {offset: 0, opacity: '0.6', transform: 'scale(0.7)'},
                {offset: 1, opacity: '0.99', transform: 'scale(1)'}
            ])

        const parentAnipation = createAnimation()
            .duration(1000)
            .iterations(Infinity)
            .direction('alternate')
            .addAnimation([saveButtonAnimation, deleteButtonAnimation])


        parentAnipation.play();
    }

    groupedAnimation();
}, [])
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
              <IonButton onClick={handleSave} className="button-save">Save</IonButton>
              <IonButton onClick={handleDelete} className="button-delete">Delete</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel>Name: </IonLabel>
          <IonInput
            value={name}
            onIonChange={(e) => setName(e.detail.value || "")}
          />
        </IonItem>
        <IonItem>
          <IonLabel>Description</IonLabel>
          <IonInput
            value={description}
            onIonChange={(e) => setDescription(e.detail.value || "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel>Available: </IonLabel>
          <IonCheckbox
            checked={available}
            onIonChange={(e) => setAvailable(e.detail.checked)}
          />
        </IonItem>
        <IonDatetime
          value={expiration_date}
          onIonChange={(e) => setExpirationDate(e.detail.value?.split("T")[0]!)}
        ></IonDatetime>
        <img src={photoPath} />
        <MyMap
            lat={latitude}
            lng={longitude}
            onMapClick={(location: any) => {
              setLatitude(location.latLng.lat());
              setLongitude(location.latLng.lng());
            }}
          />
        {itemV2 && (
          <>
            <IonItem>
              <IonLabel>Name: {itemV2.name}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Description: {itemV2.description}</IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>Available: </IonLabel>
              <IonCheckbox checked={itemV2.available} disabled />
            </IonItem>
            <IonDatetime value={itemV2.expiration_date} disabled></IonDatetime>
            <IonButton onClick={handleConflict1}>First Version</IonButton>
            <IonButton onClick={handleConflict2}>Second Version</IonButton>
          </>
        )}
        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || "Failed to save item"}</div>
        )}
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton
            onClick={() => {
              const photoTaken = takePhoto();
              photoTaken.then((data) => {
                setPhotoPath(data.webviewPath!);
              });
            }}
          >
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>
        <IonActionSheet
          isOpen={!!photoToDelete}
          buttons={[
            {
              text: "Delete",
              role: "destructive",
              icon: trash,
              handler: () => {
                if (photoToDelete) {
                  deletePhoto(photoToDelete);
                  setPhotoToDelete(undefined);
                }
              },
            },
            {
              text: "Cancel",
              icon: close,
              role: "cancel",
            },
          ]}
          onDidDismiss={() => setPhotoToDelete(undefined)}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProductEdit;
