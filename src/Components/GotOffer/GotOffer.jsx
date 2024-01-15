/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

const GotOffer = ({ formattedOfferDetails, onConfirm, onCancel }) => {
  
  useEffect(() => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: true,
      allowOutsideClick: false, 
    });

    swalWithBootstrapButtons
      .fire({
        html: formattedOfferDetails,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, Accept Offer!',
        cancelButtonText: 'No, Cancel!',
        reverseButtons: true,
        padding: '2rem',
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: 'Confirm!',
            text: 'Your Order is Scheduled.',
            icon: 'success',
          });
          // Call onConfirm function if provided
          if (onConfirm) {
            onConfirm();
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Cancelled',
            text: 'You cancelled the offer!',
            icon: 'error',
          });
          // Call onCancel function if provided
          if (onCancel) {
            onCancel();
          }
        }
      });
  }, [formattedOfferDetails, onConfirm, onCancel]);

  return <></>; // You can return null or an empty fragment
};

export default GotOffer;
