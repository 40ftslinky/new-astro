// instagram js

// wrap everything in astro:page-load event listener
document.addEventListener('astro:page-load', () => {
    const feed = new Instafeed({
        accessToken
        // get: 'user',
        // userId: '17841405793187218',
        // clientId: '17841405793187218',
        //
        // get: 'tagged',   
        // tagName: 'cat',
        // clientId: '17841405793187218',
        //
        // get: 'location',
        // locationId: '213385402',
        // clientId: '17841405793187218',
        //
        // get: 'media',
        // clientId: '17841405793187218',
        //
        // get: 'location',
        // locationId: '213385402',
        // clientId: '17841405793187218',
        //
        // get: 'location',
        // locationId: '213385402',
        // clientId: '17841405793187218',
        });
        feed.run();
    }
);
//
//

// Function to create the Instagram feed with image and rollover state
function createInstagramFeed() {
    const feedContainer = document.getElementById('instafeed');
    if (!feedContainer) return;

    const feed = new Instafeed({
        accessToken: 'YOUR_ACCESS_TOKEN',
        template: '<a href="{{link}}" target="_blank"><img src="{{image}}" alt="{{caption}}" class="insta-image"/></a>',
        after: function() {
            const images = document.querySelectorAll('.insta-image');
            images.forEach(image => {
                image.addEventListener('mouseover', () => {
                    image.style.opacity = '0.7';
                });
                image.addEventListener('mouseout', () => {
                    image.style.opacity = '1';
                });
            });
        }
    });
    feed.run();
}

// Call the function to create the Instagram feed
createInstagramFeed();