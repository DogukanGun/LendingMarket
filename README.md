# DAO Pool Management System

This repository is the home for a DAO Pool Management System, combining Solidity smart contracts with a Next.js web application to provide a comprehensive solution for decentralized pool management within a DAO structure.

## Overview

The system allows actors to join a DAO, participate in voting, create liquidity pools, and interact with the pools through a web application. The smart contracts handle the core logic and state of the pools, while the Next.js application provides a user interface for easy interaction.

## Smart Contracts

Written in Solidity, the smart contracts consist of:

- `DAO`: Manages DAO membership, proposal voting, and decision-making processes.
- `PoolFactory`: Facilitates the creation of new pool contracts with dynamic generation.
- `PoolData`: Stores and handles data for individual pools.
- `Pool`: Serves as a base for individual pool contracts created by the Pool Factory.

## Web Application

The web application, built with Next.js, serves as the front end and includes:

- Interactive UI for DAO participation.
- Functions to create and manage pools.
- Real-time data display from the `PoolData` contract.

## App Architecture

![LightlinkArch](https://github.com/DogukanGun/LendingMarket/assets/59707019/808e5a5a-dde7-452b-bd57-24a2ce232cdc)
