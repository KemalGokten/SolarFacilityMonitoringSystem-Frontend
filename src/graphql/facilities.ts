// src/graphql/queries/facilities.ts
import { gql } from "@apollo/client";

// Query to get all facilities for a specific user
export const GET_FACILITIES = gql`
  query GetFacilities($userId: String!) {
    facilities(userId: $userId) {
      success
      total
      facilities {
        id
        name
        nominalPower
        facilityPerformance {
          timestamps
          active_power_kWs
          energy_kWhs
        }
      }
    }
  }
`;

// Query to get a specific facility by ID
export const GET_FACILITY = gql`
  query GetFacility($id: String!) {
    facility(id: $id) {
      id
      name
      nominalPower
      facilityPerformance {
        timestamps
        active_power_kWs
        energy_kWhs
      }
    }
  }
`;

// Mutation to create a new facility
export const CREATE_FACILITY = gql`
  mutation CreateFacility(
    $name: String!
    $nominalPower: Int!
    $userId: String!
  ) {
    createFacility(name: $name, nominalPower: $nominalPower, userId: $userId) {
      id
      name
      nominalPower
    }
  }
`;

// Mutation to update an existing facility
export const UPDATE_FACILITY = gql`
  mutation UpdateFacility($id: String!, $name: String, $nominalPower: Int) {
    updateFacility(id: $id, name: $name, nominalPower: $nominalPower) {
      id
      name
      nominalPower
    }
  }
`;

// Mutation to delete a facility
export const DELETE_FACILITY = gql`
  mutation DeleteFacility($id: String!) {
    deleteFacility(id: $id) {
      success
      message
      id
    }
  }
`;
