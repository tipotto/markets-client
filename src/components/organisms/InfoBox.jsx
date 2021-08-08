import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import infoBoxCss from '../../style/infoBox';

const InfoBox = ({ title, minPrice, maxPrice }) => {
  const { infoBox, priceBox } = infoBoxCss();
  return (
    <Card className={infoBox}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <div className={priceBox}>
          ¥ {!minPrice ? maxPrice : minPrice + ' - ' + maxPrice}
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
