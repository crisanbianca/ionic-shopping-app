import React, {useEffect, useState} from 'react';
import {createAnimation, IonModal, IonButton, IonContent} from '@ionic/react';

export const Modal: (props: { open: boolean, description: string, expiration_date: string, showModal: any })
    => JSX.Element = (props: { open: boolean, description: string, expiration_date: string, showModal: any }) => {
    const [showModal, setShowModal] = useState(props.open);

    const enterAnimation = (baseEl: any) => {
        const backdropAnimation = createAnimation()
            .addElement(baseEl.querySelector('ion-backdrop')!)
            .fromTo('opacity', '0.0', '0.4');

        const wrapperAnimation = createAnimation()
            .addElement(baseEl.querySelector('.modal-wrapper')!)
            .keyframes([
                {offset: 0, opacity: '0', transform: 'scale(0)'},
                {offset: 1, opacity: '0.99', transform: 'scale(1)'}
            ]);

        return createAnimation()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(500)
            .addAnimation([backdropAnimation, wrapperAnimation]);
    }

    const leaveAnimation = (baseEl: any) => {
        return enterAnimation(baseEl).direction('reverse');
    }

    return (
        <>
            <IonModal isOpen={props.open} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation} cssClass = 'modal'>
                <div>
                    <p>Description: {props.description}</p>
                    <p>Expiration date: {props.expiration_date}</p>
                </div>
                <IonButton onClick={() => props.showModal(false)}>Close</IonButton>
            </IonModal>

        </>
    );
};