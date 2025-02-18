// collections

// Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// Import the glob loader
import { glob } from 'astro/loaders';


// Define a `loader` and `schema` for each collection
const projects = defineCollection({
    loader: glob({ 
        pattern: "**/*.{md,mdx}", 
        base: "./src/content/projects/"
    }),
    
	// Type-check frontmatter using a schema
    schema: ({ image }) => z.object({
        uniqueID: z.string(),
        title: z.string(),
        pubDate: z.coerce.date(),
        head: z.string(),
        description: z.string(),
        author: z.string(),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        coverWidth: z.string().optional(),
        coverHeight: z.string().optional(),
        image: z.object({
            // url: z.string().optional(),
            alt: z.string().optional(),
            width: z.string().optional(),
            height: z.string().optional(),
        }).optional(),
        video: z.object({
            url: z.string().optional(),
            width: z.string(),
            height: z.string(),
            poster: z.string().optional(),
        }).optional(),
        tags: z.array(z.string()).optional(),
        industry: z.array(z.string()).optional(),
        // Add other fields as necessary
    })
});


// image and video are optional fields, so they are wrapped in z.object().optional().
// The `url` field is required, while the `alt`, `width`, and `height` fields are optional.

// const clients = defineCollection({
//     loader: glob({ 
//         pattern: "**/*.{svg,png,jpg,jpeg}",
//         base: "./src/assets/clients/" 
//     }),
//     schema: ({ image }) => z.object({
//         uniqueID: z.string(),
//         title: z.string(),
//         image: z.object({
//             url: z.string().optional(),
//             alt: z.string(),
//             width: z.string(),
//             height: z.string(),
//         }).optional(),
        
//     })
// });


// 3. Export a single `collections` object to register your collection(s)
export const collections = {
    // clients,
    projects,
    // project: projects,
};
