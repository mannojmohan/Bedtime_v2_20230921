import React from "react";

import MainHeader from "../components/MainHeader";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


import bookshelf from '../../images/bookshelf.jpg';
import voices from '../../images/voices.jpg';


export default function Index() {
    return (
        <div className="tall:py-4 p-4 lg:p-8">

            <MainHeader text="Home" />
            <p className="py-2">
                Welcome! We're excited to have you here.
            </p>

            <div className="flex flex-col md:flex-row md:gap-4">

            <Card sx={{ maxWidth: 345, my: 2 }} >
                <CardMedia
                    sx={{ height: 160 }}
                    image={bookshelf}
                    title="bookshelf"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Books
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        It all starts with beautiful and engaging children's books that will connect your child to your cultural heritage!
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button href="#/books">See books</Button>
                </CardActions>
            </Card>

            <Card sx={{ maxWidth: 345, my: 2 }} >
                <CardMedia
                    sx={{ height: 160 }}
                    image={voices}
                    title="voices and recordings"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Recordings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Got books? We'll make them sound as anyone you want! A parent, grandparent, uncle or maybe yourself? You chose.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button href="#/recordings">Configure custom narrations</Button>
                </CardActions>
            </Card>

            </div>
        </div>

    );
}