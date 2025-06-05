import React, { useState, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  MenuList,
  MenuItem,
  Popper,
} from "@mui/material";

type Pool = {
  tokenA: { icon: string; symbol: string };
  tokenB: { icon: string; symbol: string };
  contractAddress: string;
};

interface CustomDropdownProps {
  pools: Pool[];
  selectedPoolForVolume: string | undefined;
  setSelectedPoolForVolume: (pool: string | undefined) => void;
}

const CustomDropdown = ({
  pools,
  selectedPoolForVolume,
  setSelectedPoolForVolume,
}: CustomDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const anchorRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef(null);

  const filteredPools = useMemo(() => {
    if (!searchTerm) return pools;
    return pools.filter(
      (pool) =>
        pool.tokenA.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pool.tokenB.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pools, searchTerm]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: any) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    if (searchRef.current?.contains(event.target)) {
      return; // keep it open if the click is inside the search
    }

    setOpen(false);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    poolAddress: string | undefined
  ) => {
    setSelectedPoolForVolume(poolAddress);
    setOpen(false);
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "auto" },
            minWidth: "120px",
            color: "var(--neutral-300, #D4D4D4)",
            fontFamily: "Ubuntu",
            background: "var(--neutral-900, #171717)",
            borderRadius: "1rem",
            fontSize: "0.75rem",
            fontWeight: 400,
            border: "1px solid var(--neutral-700, #404040)",
            padding: "8px 12px",
            cursor: "pointer",
            textAlign: "left",
            "&:hover": {
              borderColor: "var(--neutral-500, #737373)",
            },
          }}
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          {selectedPoolForVolume === undefined ||
          selectedPoolForVolume === "All"
            ? "All Pools"
            : pools.find((p) => p.contractAddress === selectedPoolForVolume)
                ?.tokenA.symbol +
              " / " +
              pools.find((p) => p.contractAddress === selectedPoolForVolume)
                ?.tokenB.symbol}
        </Box>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          sx={{ zIndex: 1000 }}
        >
          <Paper
            sx={{
              background: "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
              border: "1px solid #292B2C",
              borderRadius: "0.5rem",
              boxShadow:
                "-3px 3px 10px 0px rgba(25, 13, 1, 0.10),-12px 13px 18px 0px rgba(25, 13, 1, 0.09),-26px 30px 24px 0px rgba(25, 13, 1, 0.05),-46px 53px 28px 0px rgba(25, 13, 1, 0.02),-73px 83px 31px 0px rgba(25, 13, 1, 0.00)",
              marginTop: "0.5rem",
              zIndex: 100,
            }}
          >
            <MenuList
              autoFocusItem={open}
              id="composition-menu"
              aria-labelledby="composition-button"
              sx={{
                padding: "0.5rem",
                maxHeight: 300,
                overflowY: "auto",
              }}
            >
              <MenuItem
                disabled
                disableRipple
                onClick={(e) => e.stopPropagation()}
                style={{
                  pointerEvents: "none",
                  paddingTop: 0,
                  paddingBottom: "0.5rem",
                }}
              >
                <Box
                  sx={{ pointerEvents: "auto", width: "100%" }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                  }}
                >
                  <TextField
                    inputRef={searchRef}
                    placeholder="Search Pools"
                    variant="standard"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      disableUnderline: true,
                      style: { color: "var(--neutral-300, #D4D4D4)" },
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        padding: 0,
                      },
                    }}
                  />
                </Box>
              </MenuItem>
              <MenuItem
                onClick={(event) => handleMenuItemClick(event, undefined)}
                sx={{
                  textAlign: "center",
                  color: "var(--neutral-300, #D4D4D4)",
                }}
              >
                All
              </MenuItem>
              {filteredPools.map((pool) => (
                <MenuItem
                  key={pool.contractAddress}
                  onClick={(event) =>
                    handleMenuItemClick(event, pool.contractAddress)
                  }
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img
                      src={pool.tokenA.icon}
                      alt={pool.tokenA.symbol}
                      width={20}
                    />
                    <Typography color="var(--neutral-300, #D4D4D4)">
                      {pool.tokenA.symbol}
                    </Typography>
                    <Typography>/</Typography>
                    <img
                      src={pool.tokenB.icon}
                      alt={pool.tokenB.symbol}
                      width={20}
                    />
                    <Typography color="var(--neutral-300, #D4D4D4)">
                      {pool.tokenB.symbol}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        </Popper>
      </Box>
    </div>
  );
};

export { CustomDropdown };
