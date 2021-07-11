// React context to pass Context.Provider data to all child components (for now: Dashboard)
// Learn more at react website

import React, {Component, createContext, useState, useEffect} from 'react';

import Dashboard from '../components/dashboard';
import Door from '../components/door';
import Api from '../modules/api';

const MainContext = React.createContext('');

export default MainContext;