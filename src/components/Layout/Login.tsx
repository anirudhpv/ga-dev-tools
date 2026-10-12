import * as React from "react"
import { styled } from "@mui/material/styles"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import PersonIcon from "@mui/icons-material/Person"
import Avatar from "@mui/material/Avatar"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import Divider from "@mui/material/Divider"
import LogoutIcon from "@mui/icons-material/Logout"
import Typography from "@mui/material/Typography"
import { UserStatus } from "./useLogin"

const Root = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 0,
  "& .details": {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginRight: theme.spacing(0.5),
    minWidth: 0,
    "& > *": {
      maxWidth: "28ch",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      lineHeight: 1.3,
    },
  },
}))

interface LoginProps {
  className?: string
  user: any
  profile?: Profile
  // Show the user's name & email next to their avatar.
  showDetails?: boolean
  userStatus: UserStatus
  login: () => void
  logout: () => void
}

const Login: React.FC<LoginProps> = ({
  className,
  user,
  profile,
  showDetails,
  userStatus,
  login,
  logout,
}) => {
  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null)

  if (userStatus === UserStatus.Pending) {
    return null
  }

  if (user === undefined) {
    return (
      <Tooltip title="Login">
        <IconButton className={className} onClick={login}>
          <PersonOutlineIcon />
        </IconButton>
      </Tooltip>
    )
  }

  const closeMenu = () => setMenuAnchor(null)

  return (
    <Root className={className}>
      {showDetails && (profile?.name || profile?.email) && (
        <div className="details">
          {profile.name && (
            <Typography variant="body2">{profile.name}</Typography>
          )}
          {profile.email && (
            <Typography variant="caption" color="text.secondary">
              {profile.email}
            </Typography>
          )}
        </div>
      )}
      <Tooltip title="Account">
        <IconButton
          onClick={e => setMenuAnchor(e.currentTarget)}
          aria-label="Account menu"
          aria-haspopup="menu"
          aria-expanded={menuAnchor !== null}
        >
          {profile?.picture ? (
            <Avatar
              src={profile.picture}
              alt={profile.name || ""}
              imgProps={{ referrerPolicy: "no-referrer" }}
              sx={{ width: 32, height: 32 }}
            />
          ) : (
            <PersonIcon />
          )}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={menuAnchor}
        open={menuAnchor !== null}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {(profile?.name || profile?.email) && [
          <MenuItem key="profile" disabled sx={{ opacity: "1 !important" }}>
            <div>
              {profile.name && (
                <Typography variant="body2">{profile.name}</Typography>
              )}
              {profile.email && (
                <Typography variant="caption" color="text.secondary">
                  {profile.email}
                </Typography>
              )}
            </div>
          </MenuItem>,
          <Divider key="divider" />,
        ]}
        <MenuItem
          onClick={() => {
            closeMenu()
            logout()
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </Root>
  )
}

export default Login
