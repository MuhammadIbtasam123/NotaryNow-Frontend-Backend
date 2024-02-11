import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea } from '@mui/material';
import ibtasamImg from '../../assets/images/ibtasam-fyp.jpg';
import usaidImg from '../../assets/images/usaid.png';
import './homeStyles.css';

const Team = () => {
  const team=[
    {
      Id: 1,
      name: 'Muhammad Ibtasam',
      designation: 'Full Stack Developer (MERN)',
      companyRole: 'Co-Founder of NotaryNow',
      description: 'Dedicated and hardworking individual with a passion for web development especially in MERN stack.',
      image: ibtasamImg
    },
    {
      Id: 2,
      name: 'Muhammad Usaid',
      designation: 'Team Lead | Full Stack Developer ',
      companyRole: 'CEO of NotaryNow',
      description: 'Hardworking individual with a passion for web development especially in MERN stack.',
      image: usaidImg
    },
    {
      Id: 3,
      name: 'Muhammad Hasnain',
      designation: 'Full Stack Developer (PYTHON/Django)',
      companyRole: 'Co-Founder of NotaryNow',
      description: 'Passion-driven individual with a passion for web development especially in PYTHON/DJANGO stack.',
      image: ibtasamImg
    }
  ];

  return (
    <Box className="team-container">
      <Box>
        <Typography gutterBottom variant="h3" component="div" className="section-heading">
          Meet Our Team
        </Typography>
      </Box>

      <Box className="team-cards">
        {team.map((item) => (
          <Card className="team-card" key={item.Id}>
            <CardActionArea>
              <CardMedia
                component="img"
                height={item.Id === 2 ? "290" : "270"}
                image={item.image}
                alt="CEO'S"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {item.companyRole}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {item.designation}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

export default Team;




