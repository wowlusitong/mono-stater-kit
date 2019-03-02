import React from 'react';
import { Alert } from 'react-bootstrap';
import ComponentB from 'component-b';

export default () => (
  <div>
    <Alert variant="primary">
      我是用boostrap的项目: www-b
    </Alert>
    <ComponentB />
  </div>
);
