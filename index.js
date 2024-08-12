const AWS = require('aws-sdk');
const express = require('express');
const cors = require('cors');

const app1 = express();
const app2 = express();

app1.use(cors());
app2.use(cors());

const port1 = 4000;
const port2 = 4001;

// AWS S3 configuration for both apps
const s3Config1 = new AWS.S3({
    accessKeyId: 'AKIA5FTZAMDZPJHILCNA',
    secretAccessKey: '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',
    region: 'us-east-1'
});

const s3Config2 = new AWS.S3({
    accessKeyId: 'AKIA5FTZAMDZPJHILCNA',
    secretAccessKey: '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',
    region: 'us-east-1'
});

const bucketName1 = 'scholar-role';
const bucketName2 = 'fisherman-role';

// Function to list objects in the first bucket for a specific phone number
const listObjectsByPhoneNumber1 = async (phoneNumber) => {
    const params = {
        Bucket: bucketName1,
        Prefix: `${phoneNumber}/`
    };

    try {
        const data = await s3Config1.listObjectsV2(params).promise();
        return data.Contents;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Function to list objects in the second bucket for a specific phone number
const listObjectsByPhoneNumber2 = async (phoneNumber) => {
    const params = {
        Bucket: bucketName2,
        Prefix: `${phoneNumber}/`
    };

    try {
        const data = await s3Config2.listObjectsV2(params).promise();
        return data.Contents;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Route to get image URLs by phone number for the first app
app1.get('/images', async (req, res) => {
    const phone = req.query.phone;
    if (!phone) {
        return res.status(400).send('Phone number is required');
    }

    const objects = await listObjectsByPhoneNumber1(phone);
    const imageUrls = objects
        .filter(obj => obj.Key.match(/\.(jpg|jpeg|png|gif)$/))
        .map(obj => `https://${bucketName1}.s3.amazonaws.com/${obj.Key}`);

    res.json(imageUrls);
});

// Route to get image URLs by phone number for the second app
app2.get('/fisherman-images', async (req, res) => {
    const phone = req.query.phone;
    if (!phone) {
        return res.status(400).send('Phone number is required');
    }

    const objects = await listObjectsByPhoneNumber2(phone);
    const imageUrls = objects
        .filter(obj => obj.Key.match(/\.(jpg|jpeg|png|gif)$/))
        .map(obj => `https://${bucketName2}.s3.amazonaws.com/${obj.Key}`);

    res.json(imageUrls);
});

app1.listen(port1, () => {
    console.log(`Server running at http://localhost:${port1}`);
});

app2.listen(port2, () => {
    console.log(`Server running at http://localhost:${port2}`);
});
