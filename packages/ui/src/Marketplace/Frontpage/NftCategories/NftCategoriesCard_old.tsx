import React from "react";
import { NftCategoriesCardProps } from "@phoenix-protocol/types";
import { BaseNftCard } from "../../Shared/BaseNftCard";

const NftCategoriesCard = (props: NftCategoriesCardProps) => {
  return (
    <BaseNftCard
      id={props.id}
      _onClick={props._onClick}
      image={props.image}
      collectionName=""
      nftName={props.name}
      showVolume={false}
      bottomContent={null} // Categories only show the name
      aspectRatio="4/3" // Categories use a different aspect ratio
      size="medium"
    />
  );
};
              "linear-gradient(45deg, transparent 30%, rgba(249, 115, 22, 0.03) 50%, transparent 70%)",
            opacity: 0,
            transition: "opacity 0.3s ease",
            zIndex: 1,
          },
          "&:hover:before": {
            opacity: 1,
          },
        }}
      >
        {/* Image Container */}
        <Box
          sx={{
            position: "relative",
            flex: 1,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            className="category-image"
            component="img"
            src={props.image}
            alt={`${props.name} category`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
          />

          {/* Gradient Overlay */}
          <Box
            className="gradient-overlay"
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60%",
              background:
                "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%)",
              opacity: 0.6,
              transition: "opacity 0.3s ease",
            }}
          />
        </Box>

        {/* Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            p: { xs: 2, md: 3 },
          }}
        >
          <Typography
            sx={{
              color: "#FAFAFA",
              fontSize: { xs: "0.875rem", md: "1rem" },
              fontWeight: 700,
              fontFamily: "Ubuntu, sans-serif",
              lineHeight: 1.2,
            }}
          >
            {props.name}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default NftCategoriesCard;
