import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

import Chart from "./Chart"; // Import the Chart component

import {
  useGetFacilityLazyQuery,
  useGetFacilitiesLazyQuery,
} from "../graphql/generated";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const uploadFile = async (file: File, facilityId: string) => {
  const formData = new FormData();
  formData.append("csvFile", file);
  formData.append("fileName", file.name);
  formData.append("facilityId", facilityId);

  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/uploads/readCSVFile`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("File upload failed");
  }

  return response.json();
};

export default function Monitoring() {
  const { user } = useAuth();
  const { facilityId: urlFacilityId } = useParams<{ facilityId?: string }>();

  const [
    getFacility,
    { data: facilityData, loading: facilityLoading, error: facilityError },
  ] = useGetFacilityLazyQuery({
    fetchPolicy: "network-only",
  });
  const [
    getFacilities,
    {
      data: allFacilitiesData,
      loading: facilitiesLoading,
      error: facilitiesError,
    },
  ] = useGetFacilitiesLazyQuery({
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const fetchFacility = async () => {
      let idToFetch: string | null = null;

      if (urlFacilityId) {
        idToFetch = urlFacilityId;
      } else {
        const lastVisitedFacilityId = localStorage.getItem(
          "lastVisitedFacilityId"
        );

        if (lastVisitedFacilityId) {
          idToFetch = lastVisitedFacilityId;
        } else {
          await getFacilities({ variables: { userId: user?.id || "" } });
          if (
            allFacilitiesData &&
            allFacilitiesData.facilities &&
            allFacilitiesData.facilities.facilities.length > 0
          ) {
            idToFetch = allFacilitiesData.facilities.facilities[0].id;
          }
        }
      }

      if (idToFetch) {
        await getFacility({ variables: { id: idToFetch } });
      }
    };

    fetchFacility();
  }, [urlFacilityId, getFacility, getFacilities, allFacilitiesData, user?.id]);

  useEffect(() => {
    if (facilityData && facilityData.facility) {
      localStorage.setItem("lastVisitedFacilityId", facilityData.facility.id);
    }
  }, [facilityData]);

  const uploadFileHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      console.error("No files selected");
      return;
    }

    const file = files[0];

    try {
      if (!facilityData) {
        throw new Error("Facility Data is empty");
      }
      await uploadFile(file, facilityData.facility.id);
      await getFacility({ variables: { id: facilityData.facility.id } });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  if (facilityLoading || facilitiesLoading) return <div>Loading...</div>;
  if (facilityError) return <div>Error: {facilityError.message}</div>;
  if (facilitiesError) return <div>Error: {facilitiesError.message}</div>;

  const facility = facilityData?.facility;

  return (
    <div>
      <h1>Monitoring</h1>
      {facility ? (
        <div>
          <h3>Facility Name:{facility.name}</h3>
          <h4>Nominal Power: {facility.nominalPower}</h4>
          {/* Additional facility performance chart */}
          {facility.facilityPerformance ? (
            <div>
              <Chart data={facility.facilityPerformance} />
            </div>
          ) : (
            <div>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Upload Performance Data
                <VisuallyHiddenInput
                  type="file"
                  onChange={uploadFileHandler}
                  accept="text/csv"
                />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div>No facility found</div>
      )}
    </div>
  );
}
