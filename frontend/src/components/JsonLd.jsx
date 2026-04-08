import React from 'react';
import { Helmet } from 'react-helmet-async';

function JsonLd({ data }) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}

export default JsonLd;
