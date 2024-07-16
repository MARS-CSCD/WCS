const AWS = require('aws-sdk');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());

// AWS S3 configuration
const s3 = new AWS.S3({
    accessKeyId: 'AKIA5FTZAMDZPJHILCNA',
    secretAccessKey: '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',
    region: 'us-east-1'
});

// Set the bucket name
const bucketName = 'scholar-role';

// Function to list objects in the bucket for a specific phone number
const listObjectsByPhoneNumber = async (phoneNumber) => {
    const params = {
        Bucket: bucketName,
        Prefix: `${phoneNumber}/`
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        return data.Contents;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Route to get image URLs by phone number
app.get('/images', async (req, res) => {
    const phone = req.query.phone;
    if (!phone) {
        return res.status(400).send('Phone number is required');
    }

    const objects = await listObjectsByPhoneNumber(phone);
    const imageUrls = objects
        .filter(obj => obj.Key.match(/\.(jpg|jpeg|png|gif)$/))
        .map(obj => `https://${bucketName}.s3.amazonaws.com/${obj.Key}`);

    res.json(imageUrls);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
