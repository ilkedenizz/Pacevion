// scripts/verifyRealApiData.ts
import { fetchClient } from '../src/api/fetchClient';
import type { MRDataRaceResultsResponse, MRDataPitStopsResponse, MRDataQualifyingResponse } from '../src/api/types';
import { liveRaceTracker } from '../src/services/liveRaceTracker';
import { liveNotificationStore } from '../src/services/liveNotificationStore';

async function verifyRealApi() {
  console.log('\n--- Verifying Real Jolpica / Ergast API Endpoints ---\n');

  try {
    // 1. Fetch completed race results (e.g. 2024 round 1 Bahrain GP)
    console.log('1. Testing GET /2024/1/results.json...');
    const resultsData = await fetchClient<MRDataRaceResultsResponse>('/2024/1/results.json');
    const races = resultsData?.MRData?.RaceTable?.Races;
    if (!races || races.length === 0) {
      throw new Error('No race results returned from real API');
    }
    const race = races[0];
    console.log(`   ✓ Successfully fetched: ${race.raceName} (${race.season} Round ${race.round})`);
    console.log(`   ✓ Results count: ${race.Results.length}`);
    
    // Validate result fields
    const p1 = race.Results[0];
    console.log(`   ✓ P1: ${p1.Driver.givenName} ${p1.Driver.familyName} (${p1.Driver.code || p1.Driver.driverId}) - ${p1.Constructor.name} - Status: ${p1.status} - Laps: ${p1.laps}`);
    if (p1.FastestLap) {
      console.log(`   ✓ Fastest Lap Rank 1: Lap ${p1.FastestLap.lap} Time: ${p1.FastestLap.Time.time}`);
    }

    // 2. Fetch pit stops (2024 round 1)
    console.log('\n2. Testing GET /2024/1/pitstops.json...');
    const pitData = await fetchClient<MRDataPitStopsResponse>('/2024/1/pitstops.json?limit=100');
    const pitRaces = pitData?.MRData?.RaceTable?.Races;
    const pitStops = pitRaces && pitRaces.length > 0 && pitRaces[0].PitStops ? pitRaces[0].PitStops : [];
    console.log(`   ✓ Pit stops count: ${pitStops.length}`);
    if (pitStops.length > 0) {
      const firstPit = pitStops[0];
      console.log(`   ✓ First pit stop: Driver ${firstPit.driverId} on Lap ${firstPit.lap}, Stop #${firstPit.stop}, Duration: ${firstPit.duration || 'N/A'}`);
    }

    // 3. Fetch Qualifying
    console.log('\n3. Testing GET /2024/1/qualifying.json...');
    const qualyData = await fetchClient<MRDataQualifyingResponse>('/2024/1/qualifying.json');
    const qualyRaces = qualyData?.MRData?.RaceTable?.Races;
    const qualyResults = qualyRaces && qualyRaces.length > 0 && qualyRaces[0].QualifyingResults ? qualyRaces[0].QualifyingResults : [];
    console.log(`   ✓ Qualifying results count: ${qualyResults.length}`);
    if (qualyResults.length > 0) {
      const pole = qualyResults[0];
      console.log(`   ✓ Pole: ${pole.Driver.givenName} ${pole.Driver.familyName} - Q3: ${pole.Q3 || 'N/A'}`);
    }

    // 4. Pass real race data and pit data through liveRaceTracker
    console.log('\n4. Feeding real race data through LiveRaceTracker...');
    liveNotificationStore.reset();
    liveRaceTracker.reset();

    liveRaceTracker.processRaceResults(race, pitStops);
    const generatedNotifs = liveNotificationStore.getNotifications();
    console.log(`   ✓ LiveRaceTracker processed completed race and generated ${generatedNotifs.length} event notifications.`);
    
    const typesSummary = generatedNotifs.map(n => n.type);
    console.log(`   ✓ Event types detected: ${Array.from(new Set(typesSummary)).join(', ')}`);

    // Verify duplicate suppression with real data
    const countBeforeDup = generatedNotifs.length;
    liveRaceTracker.processRaceResults(race, pitStops);
    const countAfterDup = liveNotificationStore.getNotifications().length;
    if (countBeforeDup === countAfterDup) {
      console.log(`   ✓ Duplicate protection confirmed: Repeated real API feed produced 0 extra notifications (${countBeforeDup} === ${countAfterDup})`);
    } else {
      throw new Error(`Duplicate protection failed with real data! Expected ${countBeforeDup}, got ${countAfterDup}`);
    }

    console.log('\n✓ Real API integration and response mapping verification SUCCESSFUL!\n');
  } catch (error) {
    console.error('API Verification Error:', error);
    process.exit(1);
  }
}

verifyRealApi();
