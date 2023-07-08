document.addEventListener('DOMContentLoaded', () => {
    const eventsContainer = document.getElementById('events-container');

    // Fetch all events from the backend
    fetch('http://localhost:8080/events')
        .then(response => response.json())
        .then(events => {
            events.forEach(event => {
                const eventCard = createEventCard(event);
                eventsContainer.appendChild(eventCard);
            });
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            displayError('Error fetching events');
        });

    function createEventCard(event) {
        const eventCard = document.createElement('div');
        eventCard.classList.add('card', 'mb-3');

        const eventCardBody = document.createElement('div');
        eventCardBody.classList.add('card-body');

        const eventTitle = document.createElement('h5');
        eventTitle.classList.add('card-title');
        eventTitle.textContent = event.title;

        const eventDescription = document.createElement('p');
        eventDescription.classList.add('card-text');
        eventDescription.textContent = event.description;

        const eventTiming = document.createElement('p');
        eventTiming.classList.add('card-text');
        eventTiming.textContent = `Timing: ${event.timings}`;

        const eventPlayerLimit = document.createElement('p');
        eventPlayerLimit.classList.add('card-text');
        eventPlayerLimit.textContent = `Player Limit: ${event.playerLimit}`;

        const viewEventButton = document.createElement('button');
        viewEventButton.classList.add('btn', 'btn-primary');
        viewEventButton.textContent = 'View Event';
        viewEventButton.addEventListener('click', () => {
            viewEvent(event._id);
        });

        eventCardBody.appendChild(eventTitle);
        eventCardBody.appendChild(eventDescription);
        eventCardBody.appendChild(eventTiming);
        eventCardBody.appendChild(eventPlayerLimit);
        eventCardBody.appendChild(viewEventButton);

        eventCard.appendChild(eventCardBody);

        return eventCard;
    }


    function viewEvent(eventId) {
        // Fetch the specific event with populated players from the backend
        fetch(`http://localhost:8080/events/${eventId}/players`)
            .then(response => response.json())
            .then(event => {
                // Render the event details on a Bootstrap modal dialog
                const modal = createEventModal(event);
                document.body.appendChild(modal);

                // Show the modal
                const modalEl = new bootstrap.Modal(modal);
                modalEl.show();
            })
            .catch(error => {
                console.error('Error fetching event:', error);
                displayError('Error fetching event');
            });
    }

    function createEventModal(event) {
        const modal = document.createElement('div');
        modal.classList.add('modal', 'fade');
        modal.id = 'eventModal';
        modal.tabIndex = '-1';
        modal.setAttribute('aria-labelledby', 'eventModalLabel');
        modal.setAttribute('aria-hidden', 'true');

        const modalDialog = document.createElement('div');
        modalDialog.classList.add('modal-dialog', 'modal-dialog-centered', 'modal-lg');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');

        const modalTitle = document.createElement('h5');
        modalTitle.classList.add('modal-title');
        modalTitle.id = 'eventModalLabel';
        modalTitle.textContent = event.title;

        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');

        const eventDescription = document.createElement('p');
        eventDescription.textContent = event.description;

        const eventTiming = document.createElement('p');
        eventTiming.textContent = `Timing: ${event.timings}`;

        const eventPlayerLimit = document.createElement('p');
        eventPlayerLimit.textContent = `Player Limit: ${event.playerLimit}`;

        modalBody.appendChild(eventDescription);
        modalBody.appendChild(eventTiming);
        modalBody.appendChild(eventPlayerLimit);

        // Display the players' usernames
        const playersList = document.createElement('ul');
        playersList.classList.add('list-group', 'mb-3');
        event.players.forEach(player => {
            const playerItem = document.createElement('li');
            playerItem.classList.add('list-group-item');
            playerItem.textContent = player.username;
            playersList.appendChild(playerItem);
        });
        modalBody.appendChild(playersList);

        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.classList.add('btn', 'btn-secondary');
        closeButton.setAttribute('data-bs-dismiss', 'modal');
        closeButton.textContent = 'Close';

        const joinButton = document.createElement('button');
        joinButton.type = 'button';
        joinButton.classList.add('btn', 'btn-primary');
        joinButton.textContent = 'Request to Join Event';
        joinButton.addEventListener('click', () => {
            joinEvent(event._id);
        });

        modalHeader.appendChild(modalTitle);
        modalFooter.appendChild(closeButton);
        modalFooter.appendChild(joinButton);

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);

        modalDialog.appendChild(modalContent);
        modal.appendChild(modalDialog);

        return modal;
    }


    function displayError(message) {
        const alert = document.createElement('div');
        alert.classList.add('alert', 'alert-danger');
        alert.textContent = message;
        eventsContainer.appendChild(alert);
    }

    function displaySuccess(message) {
        const alert = document.createElement('div');
        alert.classList.add('alert', 'alert-success');
        alert.textContent = message;
        eventsContainer.appendChild(alert);
    }
    function joinEvent(id) {
        fetch(`http://localhost:8080/events/${id}/players`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getCookie("token")
            },
        })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Request Sent',
                        text: 'Your request to join the event has been sent.',
                        customClass: {
                            icon: 'swal-icon-success',
                            confirmButton: 'swal-button'
                        },
                        confirmButtonColor: '#0069d9'
                    });
                } else if (response.status === 400) {
                    // Request failed - event is already full
                    Swal.fire({
                        icon: 'error',
                        title: 'Event is Full',
                        text: 'Sorry, the event is already full.',
                        customClass: {
                            icon: 'swal-icon-error',
                            confirmButton: 'swal-button'
                        },
                        confirmButtonColor: '#0069d9'
                    });
                } else if (response.status === 401) {
                    // Request failed - user has already joined the event
                    Swal.fire({
                        icon: 'error',
                        title: 'Already Joined',
                        text: 'You have already joined the event.',
                        customClass: {
                            icon: 'swal-icon-error',
                            confirmButton: 'swal-button'
                        },
                        confirmButtonColor: '#0069d9'
                    });
                } else {
                    // Request failed - show a general error message
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'An error occurred. Please try again later.',
                        customClass: {
                            icon: 'swal-icon-error',
                            confirmButton: 'swal-button'
                        },
                        confirmButtonColor: '#0069d9'
                    });
                }
            })
            .catch(error => {
                console.error('Error sending request to join event:', error);
                // Show an error message
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred. Please try again later.',
                    customClass: {
                        icon: 'swal-icon-error',
                        confirmButton: 'swal-button'
                    },
                    confirmButtonColor: '#0069d9'
                });
            });
    }
});

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=");
        if (cookie[0] === name) {
            return cookie[1];
        }
    }
    return null;
}
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function logout() {
    deleteCookie("token");
    window.location.href = "./login.html";
}