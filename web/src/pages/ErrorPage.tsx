import GitHub from '@mui/icons-material/GitHub';
import Loop from '@mui/icons-material/Loop';
import Refresh from '@mui/icons-material/Refresh';
import {
  Box,
  Button,
  Collapse,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import Bowser from 'bowser';
import { isError } from 'lodash-es';
import { useMemo } from 'react';
import { useRouteError } from 'react-router-dom';
import errorImage from '../assets/error_this_is_fine.png';
import { useVersion } from '../hooks/useVersion';

const browser = Bowser.getParser(window.navigator.userAgent);

const RotatingLoopIcon = styled(Loop)({
  animation: 'spin 2s linear infinite',
});

export function ErrorPage() {
  const { data: version, isLoading: versionLoading } = useVersion();
  const error = useRouteError();
  const stack = (isError(error) ? error.stack : '') ?? '';

  const bugReportLink = useMemo(() => {
    const url = new URL(`https://github.com/chrisbenincasa/tunarr/issues/new`);
    let browserString = browser.getBrowserName();
    if (browser.getBrowserVersion()) {
      browserString += ` (${browser.getBrowserVersion()})`;
    }
    let osString = browser.getOSName();
    if (browser.getOSVersion()) {
      osString += ` (${browser.getOSVersion()})`;
    }
    url.searchParams.append('template', 'bug_report.yaml');
    url.searchParams.append('browser', browserString);
    url.searchParams.append('os', osString);
    url.searchParams.append('version', version?.tunarr ?? '');
    url.searchParams.append('logs', stack);
    return url;
  }, [version]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{ margin: 'auto', display: 'block', pl: 3 }}
        component="img"
        src={errorImage}
      />
      <p style={{ textAlign: 'center' }}>
        <Typography variant="h2" sx={{ pb: 1 }}>
          Oops!
        </Typography>
        <Typography>Looks like something went wrong.</Typography>
      </p>
      <Stack direction="row" sx={{ justifyContent: 'center' }} gap={2}>
        <Button
          onClick={() => window.location.reload()}
          variant="contained"
          startIcon={<Refresh />}
        >
          Refresh Page
        </Button>
        <Button
          component="a"
          href={bugReportLink.toString()}
          target="_blank"
          variant="contained"
          startIcon={versionLoading ? <RotatingLoopIcon /> : <GitHub />}
          disabled={versionLoading}
        >
          {versionLoading
            ? 'Generating Bug Report Link...'
            : 'File a Bug Report'}
        </Button>
      </Stack>
      {stack && (
        <Collapse in={true}>
          <Box
            component="pre"
            sx={{ width: '100%', overflowX: 'scroll', p: 1 }}
          >
            {stack}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}
