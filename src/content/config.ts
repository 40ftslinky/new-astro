// collections

// Import the glob loader
import { glob} from 'astro/loaders'; // Not available with legacy API

// Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// Define a `loader` and `schema` for each collection
const projects = defineCollection({
    loader: glob({ 
        pattern: "**/*.{md,mdx}",
        base: "./src/content/projects" 
    }),
    // type: 'content',
    schema: ({ image }) => z.object({
        uniqueID: z.string(),
        title: z.string(),
        pubDate: z.coerce.date(),
        head: z.string(),
        description: z.string(),
        author: z.string(),
        image: z.object({
            url: z.string().optional(),
            alt: z.string(),
            width: z.string(),
            height: z.string(),
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

const projectImages = defineCollection({
    loader: glob({ 
        pattern: "**/*.{jpg,jpeg,png}",
        base: "src/content/assets" 
    }),
    schema: ({ image }) => z.object({
        heroImage: image.optional(),
        title: z.string(),
        cover: image(),
        coverAlt: z.string(),
    })
});

const clients = defineCollection({
    loader: glob({ 
        pattern: "**/*.{svg,png,jpg,jpeg}",
        base: "./src/assets/clients" 
    }),
    schema: z.object({
        uniqueID: z.string(),
        title: z.string(),
        image: z.object({
            url: z.string().optional(),
            alt: z.string(),
            width: z.string(),
            height: z.string(),
        }).optional(),
        
    })
});


// 3. Export a single `collections` object to register your collection(s)
export const collections = {
    clients,
    projects,
    projectImages,
};
