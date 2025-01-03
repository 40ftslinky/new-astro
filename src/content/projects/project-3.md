---

uniqueID: 'post'
title: 'Three'
pubDate: 2023-12-30
# publishDate: 2019-12-01 00:00:00
head: 'Lorem Ipsum Head'
description: 'This is the Lorem Ipsum description.'
author: 'Jez'
image:
    # url: 'https://docs.astro.build/assets/full-logo-light.png'
    url: '/src/assets/color-gray.jpg'
    alt: 'Purple.'
    width: '100%'
    height: '100%'

video: 
    # url: './../../../public/video/Lug_casestudy.mp4'
    url: '/video/Lug_casestudy.mp4'
    # url: ''
    width: '100%'
    height: '100%'
    poster: '/src/assets/color-orange.png'
    

tags: ["pixels", "puppies", "pizza"]

contentImgs:
  - url: 'src/assets/imgs/Editorial-Mockup_00.jpg'
    alt: "Image description 1"
    width: 600
    height: 400
  - url: 'src/assets/imgs/Editorial-Mockup_01.jpg'
    alt: "Image description 2"
    width: 600
    height: 400


---


## Lorem Ipsum

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin et nisi elit. Ut sed erat velit. Vivamus a sem est. Aliquam sit amet nulla ultrices nisl pellentesque luctus. Quisque ultrices efficitur sagittis. Etiam molestie justo est, vitae vulputate nibh ultricies nec. Duis sodales lacus sed leo congue, et efficitur lacus pellentesque. Nunc enim augue, efficitur eu venenatis in, tincidunt semper nulla. Nulla eget velit ut nisi pretium lacinia. Pellentesque finibus neque eget erat scelerisque lobortis. Integer gravida orci quam, et imperdiet metus tristique quis.

### Images


Local image stored in the the same folder

![Houston in the wild](./imgs/Editorial-Mockup_00.jpg)

Local image stored in src/assets/
<Image src={editorial} alt="Editorial Mockup"/>
<img src={editorial.src} alt="Editorial Mockup"/>
![Editorial Mockup](/src/assets/project-1/Editorial-Mockup_00.jpg)


// Image stored in public/images/
<Image src="/images/Editorial-Mockup_00.jpg" alt="Editorial Mockup" width="600" height="300"/>
<img src="/images/Editorial-Mockup_00.jpg" alt="Editorial Mockup" width="600" height="300"/>
![Editorial Mockup](/images/Editorial-Mockup_00.jpg)

// Remote image on another server

<Image src="https://placebear.com/g/600/300"  alt="alt" width="600" height="300"/>
<img src="https://placebear.com/g/600/300"  alt="alt" width="600" height="300"/>

![Astro](https://placebear.com/g/600/300)

<!-- A remote image -->
A remote image
![A random remote image](https://picsum.photos/1024/768)

<!-- A local image relative to the markdown file -->
local image relative to the markdown file
![A local image](/src/assets/imgs/landscape.jpg)

<!-- A local image relative to the project root -->
A local image relative to the project root
![Another local image](/src/assets/imgs/landscape-02.avif)

<!-- An example of using query params -->
An example of using query params
![A remote image with query params](https://picsum.photos/1024/768?grayscale)

<!-- An example of the `<Image />` component inside MD pages -->
`<Image />` component

<Image
  src={frontmatter.contentImgs.url}
  alt={frontmatter.contentImgs.alt}
/>