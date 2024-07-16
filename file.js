const AWS = require('aws-sdk');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;

app.use(cors());

// AWS S3 configuration
const s3 = new AWS.S3({
    accessKeyId: 'AKIA5FTZAMDZPJHILCNA',
    secretAccessKey: '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',
    region: 'us-east-1'
});

// Set the bucket name
const bucketName = 'fisherman-role';

// Function to list objects in the bucket
const listObjects = async (prefix) => {
    const params = {
        Bucket: bucketName,
        Prefix: prefix,
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        return data.Contents;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Route to get image URLs based on phone number
app.get('/images', async (req, res) => {
    const phoneNumber = req.query.phone;
    if (!phoneNumber) {
        return res.status(400).send('Phone number is required');
    }

    const objects = await listObjects(phoneNumber);
    const images = objects.filter(obj => obj.Key.match(/\.(jpg|jpeg|png|gif)$/));
    const imageUrls = images.map(image => `https://${bucketName}.s3.amazonaws.com/${image.Key}`);

    res.json(imageUrls);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
