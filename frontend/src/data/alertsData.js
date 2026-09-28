/**
 * SEEMA DRISHTI — Alerts & Events Data Architecture
 * Smart India Hackathon 2026 | Problem Statement SIH26187
 * Ministry of Home Affairs (MHA)
 * 
 * Comprehensive Surveillance Alerts, Cross-Camera Incidents,
 * Explainable Risk Breakdown, and Event Memory Store.
 */

export const ALERT_EVENT_TYPES = [
  'Person Detection',
  'Vehicle Detection',
  'Restricted Zone Entry',
  'Cross-Camera Movement',
  'Multiple Person Detection',
  'Camera Health Warning',
  'Low-Light Detection',
  'Fog / Visibility Warning',
  'Suspicious Movement Pattern',
  'System Detection Error'
];

export const INITIAL_ALERTS = [
  // 1. DEMO HIGHLIGHT: SITUATION #024 CROSS-CAMERA ALERT
  {
    id: 'A-0241',
    alertNumber: 'ALERT #A-0241',
    title: 'Cross-Camera Movement Detected',
    severity: 'HIGH',
    eventType: 'Cross-Camera Movement',
    camera: 'CAM-01 → CAM-03 → CAM-05',
    primaryCam: 'CAM-01',
    camerasList: ['CAM-01', 'CAM-03', 'CAM-05'],
    time: '20:18:12',
    date: '28 Sep 2026',
    confidence: '91%',
    rawConfidence: 0.91,
    visibility: 'NORMAL / WATERLINE MIST',
    reducedConfidence: false,
    situation: 'SITUATION #024',
    status: 'INVESTIGATING',
    targetTrackId: 'Person P-12',
    targetClass: 'Person',
    sector: 'Sectors Alpha → Charlie → Echo',
    isCrossCamera: true,
    corridorName: 'North Border Outer Fence → Restricted Waterline Corridor → Eastern Boundary Fence',
    distanceTraversed: '770m total corridor',
    transitDuration: '3m 39s sequential transit',
    riskScore: 82,
    maxRisk: 100,
    riskLevel: 'HIGH',
    riskBreakdown: [
      { factor: 'Cross-camera movement pattern (3 sectors)', weight: '+30' },
      { factor: 'Restricted-zone presence (Waterline buffer)', weight: '+25' },
      { factor: 'Night/low-light condition (CAM-03 CLAHE)', weight: '+12' },
      { factor: 'Movement persistence (>3 min traversal)', weight: '+10' },
      { factor: 'Detection confidence (Mean 87%)', weight: '+05' }
    ],
    aiExplanation: 'System detected a person near the perimeter in CAM-01. A related movement pattern was subsequently detected in CAM-03 and CAM-05 within 4 minutes.\n\nThe system linked these observations into Situation #024.\n\nConfidence may be reduced due to low-light conditions in the river corridor.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-01',
        name: 'North Border',
        sector: 'Sector Alpha',
        img: '/cctv/cam1.jpg',
        video: '/videos/camera1.mp4',
        label: 'PERSON 91%',
        model: 'AI Person Sighting',
        time: '20:14:02',
        badge: 'CLEAR VISION',
        note: 'First spotted walking along the outer boundary fence line.'
      },
      {
        camCode: 'CAM-03',
        name: 'River Checkpoint',
        sector: 'Sector Charlie',
        img: '/cctv/cam3.jpg',
        video: '/videos/camera3.mp4',
        label: 'PERSON 82%',
        model: 'Night Vision Enhanced',
        time: '20:15:17',
        badge: 'LOW LIGHT RESTORED',
        note: 'Low visibility in river area; night vision filter automatically brightened the scene.'
      },
      {
        camCode: 'CAM-05',
        name: 'Eastern Fence',
        sector: 'Sector Echo',
        img: '/cctv/cam5.jpg',
        video: '/videos/camera5.mp4',
        label: 'PERSON 86%',
        model: 'AI Person Sighting',
        time: '20:17:41',
        badge: 'CORRIDOR ENDPOINT',
        note: 'Same direction confirmed; walking pace matched normal pedestrian speed.'
      }
    ],
    timeline: [
      {
        time: '20:14:02',
        source: 'CAM-01',
        title: 'Person detected',
        desc: 'Person entered the northern outer fence. System started recording movement route.',
        confidence: '91%',
        badge: 'NORMAL'
      },
      {
        time: '20:15:17',
        source: 'CAM-03',
        title: 'Related movement pattern detected',
        desc: 'Person observed entering river area. Night vision filter turned on automatically.',
        confidence: '82%',
        badge: 'NIGHT VISION'
      },
      {
        time: '20:17:41',
        source: 'CAM-05',
        title: 'Same movement direction detected',
        desc: 'Same person spotted along eastern boundary fence walking at steady speed.',
        confidence: '86%',
        badge: 'NORMAL'
      },
      {
        time: '20:18:12',
        source: 'SYSTEM',
        title: 'Situation #024 created',
        desc: 'System combined all 3 separate camera sightings into a single clear incident route.',
        confidence: 'HIGH MATCH',
        badge: 'CONNECTED'
      },
      {
        time: '20:18:15',
        source: 'PRIORITY',
        title: 'Priority level: High Attention (82/100)',
        desc: 'Flagged for guard review due to moving between sectors and approaching restricted river boundary.',
        confidence: '82/100',
        badge: 'HIGH ATTENTION'
      }
    ],
    auditLog: [
      { time: '20:18:12', action: 'ALERT GENERATED', by: 'Cross-Camera Correlation Engine', status: 'ACTIVE' },
      { time: '20:19:04', action: 'ACKNOWLEDGED', by: 'Commander R. K. Sharma', status: 'ACKNOWLEDGED' },
      { time: '20:20:15', action: 'MARK INVESTIGATING', by: 'Sub-Inspector V. K. Sharma', status: 'INVESTIGATING' }
    ]
  },

  // 2. CRITICAL ALERT: 5M BUFFER INVASION
  {
    id: 'A-0242',
    alertNumber: 'ALERT #A-0242',
    title: 'Unauthorized Person Detected in 5m Buffer',
    severity: 'CRITICAL',
    eventType: 'Restricted Zone Entry',
    camera: 'CAM-01',
    primaryCam: 'CAM-01',
    camerasList: ['CAM-01'],
    time: '20:21:43',
    date: '28 Sep 2026',
    confidence: '94%',
    rawConfidence: 0.94,
    visibility: 'NORMAL',
    reducedConfidence: false,
    situation: 'SITUATION #024',
    status: 'ACTIVE',
    targetTrackId: 'Person P-12',
    targetClass: 'Person',
    sector: 'Sector Alpha (North Border)',
    isCrossCamera: false,
    riskScore: 94,
    maxRisk: 100,
    riskLevel: 'CRITICAL',
    riskBreakdown: [
      { factor: '5-meter razor wire exclusion zone breach', weight: '+40' },
      { factor: 'Active target linked to Situation #024', weight: '+30' },
      { factor: 'High optical confidence (94%)', weight: '+14' },
      { factor: 'Stationary posture near anchor post', weight: '+10' }
    ],
    aiExplanation: 'Subject breached the marked 5-meter red danger zone adjacent to Fence Post 14 on CAM-01. Optical tracking maintains unbroken lock on ByteTrack ID #P-12.\n\nImmediate operator intervention recommended.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-01',
        name: 'North Border',
        sector: 'Sector Alpha',
        img: '/cctv/cam1.jpg',
        video: '/videos/camera1.mp4',
        label: 'PERSON 94%',
        model: 'YOLOv8 ACTIVE',
        time: '20:21:43',
        badge: 'CRITICAL BREACH',
        note: 'Target crossed 5m yellow restriction marker directly toward barbed wire.'
      }
    ],
    timeline: [
      {
        time: '20:20:55',
        source: 'CAM-01',
        title: 'Subject approached perimeter wire',
        desc: 'Target slowed velocity from 1.1 m/s to 0.2 m/s.',
        confidence: '92%',
        badge: 'APPROACH'
      },
      {
        time: '20:21:43',
        source: 'CAM-01',
        title: '5-Meter buffer violated',
        desc: 'Virtual geofence alarm triggered. Subject within arm-reach of barrier.',
        confidence: '94%',
        badge: 'CRITICAL'
      }
    ],
    auditLog: [
      { time: '20:21:43', action: 'CRITICAL ALERT DISPATCHED', by: 'Perimeter Defense Module', status: 'ACTIVE' }
    ]
  },

  // 3. CRITICAL ALERT: BARRIER TAMPERING
  {
    id: 'A-0240',
    alertNumber: 'ALERT #A-0240',
    title: 'Razor-Wire Barrier Tampering Motion',
    severity: 'CRITICAL',
    eventType: 'Suspicious Movement Pattern',
    camera: 'CAM-01',
    primaryCam: 'CAM-01',
    camerasList: ['CAM-01'],
    time: '20:16:50',
    date: '28 Sep 2026',
    confidence: '89%',
    rawConfidence: 0.89,
    visibility: 'NORMAL',
    reducedConfidence: false,
    situation: 'SITUATION #024',
    status: 'ACTIVE',
    targetTrackId: 'Person P-12',
    targetClass: 'Person',
    sector: 'Sector Alpha (North Border)',
    isCrossCamera: false,
    riskScore: 88,
    maxRisk: 100,
    riskLevel: 'CRITICAL',
    riskBreakdown: [
      { factor: 'Stationary loitering dwell > 45s (Recorded 64s)', weight: '+35' },
      { factor: 'Crouched posture detected', weight: '+27' },
      { factor: 'Proximity to barrier anchor point', weight: '+26' }
    ],
    aiExplanation: 'Target displayed anomalous loitering dwell of 64s exceeding the 45s tactical threshold. Periodic crouching observed near fence tension wire.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-01',
        name: 'North Border',
        sector: 'Sector Alpha',
        img: '/cctv/cam1.jpg',
        video: '/videos/camera1.mp4',
        label: 'PERSON 89%',
        model: 'YOLOv8 ACTIVE',
        time: '20:16:50',
        badge: 'TAMPERING MOTION',
        note: 'Crouched posture detected near wire anchor. Cutting tool profile flagged.'
      }
    ],
    timeline: [
      {
        time: '20:15:46',
        source: 'CAM-01',
        title: 'Loitering timer initialized',
        desc: 'Subject stopped movement near Post 14.',
        confidence: '88%',
        badge: 'DWELL START'
      },
      {
        time: '20:16:50',
        source: 'CAM-01',
        title: 'Threshold exceeded (64s dwell)',
        desc: 'Tactical dwell warning triggered near fence anchor.',
        confidence: '89%',
        badge: 'EXCEEDED'
      }
    ],
    auditLog: [
      { time: '20:16:50', action: 'LOITERING ALERT RAISED', by: 'Spatial Analytics Module', status: 'ACTIVE' }
    ]
  },

  // 4. HIGH ALERT: VEHICLE IN RESTRICTED ZONE
  {
    id: 'A-0238',
    alertNumber: 'ALERT #A-0238',
    title: 'Vehicle Detected in Restricted Zone',
    severity: 'HIGH',
    eventType: 'Vehicle Detection',
    camera: 'CAM-02',
    primaryCam: 'CAM-02',
    camerasList: ['CAM-02'],
    time: '20:14:32',
    date: '28 Sep 2026',
    confidence: '87%',
    rawConfidence: 0.87,
    visibility: 'NORMAL',
    reducedConfidence: false,
    situation: 'SITUATION #023',
    status: 'ACTIVE',
    targetTrackId: 'Vehicle V-08',
    targetClass: 'Vehicle',
    sector: 'Sector Bravo (Check Post)',
    isCrossCamera: false,
    riskScore: 74,
    maxRisk: 100,
    riskLevel: 'HIGH',
    riskBreakdown: [
      { factor: 'Unscheduled vehicle entry', weight: '+30' },
      { factor: 'Transit barrier bypass attempt', weight: '+24' },
      { factor: 'High velocity approach (34 km/h)', weight: '+20' }
    ],
    aiExplanation: 'Unidentified vehicle V-08 approached Transit Gate 2 outside scheduled logistics windows. No matching RFID clearance detected in checkpoint database.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-02',
        name: 'Check Post',
        sector: 'Sector Bravo',
        img: '/cctv/cam2.jpg',
        video: '/videos/camera2.mp4',
        label: 'VEHICLE 87%',
        model: 'YOLOv8 ACTIVE',
        time: '20:14:32',
        badge: 'RESTRICTED VEHICLE',
        note: 'Transit Gate 2 Approach Lane'
      }
    ],
    timeline: [
      {
        time: '20:13:40',
        source: 'CAM-02',
        title: 'Vehicle entered approach lane',
        desc: 'Speed radar recorded 34 km/h.',
        confidence: '85%',
        badge: 'NORMAL'
      },
      {
        time: '20:14:32',
        source: 'CAM-02',
        title: 'Restricted barrier line crossed',
        desc: 'No valid digital manifest matched.',
        confidence: '87%',
        badge: 'HIGH'
      }
    ],
    auditLog: [
      { time: '20:14:32', action: 'RESTRICTED VEHICLE ALERT', by: 'Gate Telemetry Engine', status: 'ACTIVE' }
    ]
  },

  // 5. HIGH ALERT: SUSPICIOUS TRAIL MOVEMENT
  {
    id: 'A-0236',
    alertNumber: 'ALERT #A-0236',
    title: 'Suspicious Ridge Approach Toward Bravo Pass',
    severity: 'HIGH',
    eventType: 'Suspicious Movement Pattern',
    camera: 'CAM-04',
    primaryCam: 'CAM-04',
    camerasList: ['CAM-04'],
    time: '20:12:15',
    date: '28 Sep 2026',
    confidence: '85%',
    rawConfidence: 0.85,
    visibility: 'NORMAL',
    reducedConfidence: false,
    situation: 'SITUATION #023',
    status: 'ACTIVE',
    targetTrackId: 'Person P-10',
    targetClass: 'Person',
    sector: 'Sector Delta (Perimeter Ridge)',
    isCrossCamera: false,
    riskScore: 71,
    maxRisk: 100,
    riskLevel: 'HIGH',
    riskBreakdown: [
      { factor: 'Non-standard elevation ascent', weight: '+28' },
      { factor: 'Proximity to unpatrolled gully trail', weight: '+25' },
      { factor: 'Intermediate distance tracking (65m)', weight: '+18' }
    ],
    aiExplanation: 'Target moving rapidly along blind ridge slope toward Transit Gate bypass trail. Velocity vector indicates deliberate non-road traversal.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-04',
        name: 'Perimeter Ridge',
        sector: 'Sector Delta',
        img: '/cctv/cam4.jpg',
        video: '/videos/camera4.mp4',
        label: 'PERSON 85%',
        model: 'YOLOv8 ACTIVE',
        time: '20:12:15',
        badge: 'RIDGE TRAVERSAL',
        note: 'Western flank elevation ascent'
      }
    ],
    timeline: [
      {
        time: '20:12:15',
        source: 'CAM-04',
        title: 'Ridge movement flagged',
        desc: 'Target detected on mountain pass slope.',
        confidence: '85%',
        badge: 'RIDGE ALERT'
      }
    ],
    auditLog: [
      { time: '20:12:15', action: 'ELEVATION ALERT', by: 'Terrain Analytics', status: 'ACTIVE' }
    ]
  },

  // 6. HIGH ALERT: MULTIPLE TARGETS IN WATERLINE
  {
    id: 'A-0233',
    alertNumber: 'ALERT #A-0233',
    title: 'Multiple Targets Entering Waterline Basin',
    severity: 'HIGH',
    eventType: 'Multiple Person Detection',
    camera: 'CAM-03',
    primaryCam: 'CAM-03',
    camerasList: ['CAM-03'],
    time: '20:09:50',
    date: '28 Sep 2026',
    confidence: '84%',
    rawConfidence: 0.84,
    visibility: 'LOW-LIGHT / MIST',
    reducedConfidence: true,
    reducedConfidenceNote: 'Detection confidence (84%) reduced due to river bank mist and dark water reflection. CLAHE enabled.',
    situation: 'SITUATION #022',
    status: 'ACTIVE',
    targetTrackId: 'P-08, P-09',
    targetClass: 'Person',
    sector: 'Sector Charlie (River Side)',
    isCrossCamera: false,
    riskScore: 76,
    maxRisk: 100,
    riskLevel: 'HIGH',
    riskBreakdown: [
      { factor: 'Group presence in restricted river waterline', weight: '+35' },
      { factor: 'Low-light camouflage attempt', weight: '+23' },
      { factor: 'Direct river crossing vector', weight: '+18' }
    ],
    aiExplanation: 'Two individuals detected wading through marsh shallows along river boundary line. CLAHE contrast amplification enabled YOLOv8 tracking despite water spray reflection.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-03',
        name: 'River Side',
        sector: 'Sector Charlie',
        img: '/cctv/cam3.jpg',
        video: '/videos/camera3.mp4',
        label: '2 PERSONS 84%',
        model: 'CLAHE ENHANCED',
        time: '20:09:50',
        badge: 'WATERLINE RESTRICTED',
        note: 'River depression wading detection'
      }
    ],
    timeline: [
      {
        time: '20:09:50',
        source: 'CAM-03',
        title: 'Group acquired in marsh shallows',
        desc: 'Tracks #P-08 and #P-09 assigned.',
        confidence: '84%',
        badge: 'GROUP DETECT'
      }
    ],
    auditLog: [
      { time: '20:09:50', action: 'WATERLINE INCURSION', by: 'Waterfront Sensor', status: 'ACTIVE' }
    ]
  },

  // 7. MEDIUM ALERT: LOW-LIGHT DETECTION
  {
    id: 'A-0235',
    alertNumber: 'ALERT #A-0235',
    title: 'Low-Light Detection (CLAHE Restored)',
    severity: 'MEDIUM',
    eventType: 'Low-Light Detection',
    camera: 'CAM-06',
    primaryCam: 'CAM-06',
    camerasList: ['CAM-06'],
    time: '20:11:08',
    date: '28 Sep 2026',
    confidence: '76%',
    rawConfidence: 0.76,
    visibility: 'LOW (BRIGHTNESS 48/255)',
    reducedConfidence: true,
    reducedConfidenceNote: 'Detection confidence reduced due to low visibility (18 lux ambient). OpenCV CLAHE enhancement restored +180% dynamic range.',
    situation: 'CAM-06',
    status: 'INVESTIGATING',
    targetTrackId: 'Person P-09',
    targetClass: 'Person',
    sector: 'Sector Foxtrot (Sector Gate)',
    isCrossCamera: false,
    riskScore: 58,
    maxRisk: 100,
    riskLevel: 'MEDIUM',
    riskBreakdown: [
      { factor: 'Night/low-light incursion', weight: '+24' },
      { factor: 'Perimeter sector gate approach', weight: '+20' },
      { factor: 'Reduced optical confidence adjustment', weight: '+14' }
    ],
    aiExplanation: 'Person detected in night shadows near Sector Foxtrot gate. Automatic CLAHE equalized luminance on L-channel to allow YOLOv8 identification despite sub-optimal lighting.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-06',
        name: 'Sector Gate',
        sector: 'Sector Foxtrot',
        img: '/cctv/cam6.jpg',
        video: '/videos/camera6.mp4',
        label: 'PERSON 76%',
        model: 'CLAHE ENHANCED',
        time: '20:11:08',
        badge: 'LOW LIGHT',
        note: 'Night low-light condition'
      }
    ],
    timeline: [
      {
        time: '20:10:40',
        source: 'CAM-06',
        title: 'Quality check flagged low-light',
        desc: 'Brightness dropped below 50; CLAHE triggered.',
        confidence: '—',
        badge: 'QUALITY ENGINE'
      },
      {
        time: '20:11:08',
        source: 'CAM-06',
        title: 'Person detected post-enhancement',
        desc: 'Target acquired at gate perimeter.',
        confidence: '76%',
        badge: 'ENHANCED (CLAHE)'
      }
    ],
    auditLog: [
      { time: '20:11:08', action: 'LOW-LIGHT ALERT', by: 'Enhancement Pipeline', status: 'INVESTIGATING' }
    ]
  },

  // 8. MEDIUM ALERT: PERSON NEAR PERIMETER
  {
    id: 'A-0231',
    alertNumber: 'ALERT #A-0231',
    title: 'Person Detected Near Perimeter',
    severity: 'MEDIUM',
    eventType: 'Person Detection',
    camera: 'CAM-04',
    primaryCam: 'CAM-04',
    camerasList: ['CAM-04'],
    time: '20:06:45',
    date: '28 Sep 2026',
    confidence: '82%',
    rawConfidence: 0.82,
    visibility: 'NORMAL',
    reducedConfidence: false,
    situation: 'SITUATION #022',
    status: 'ACKNOWLEDGED',
    targetTrackId: 'Person P-07',
    targetClass: 'Person',
    sector: 'Sector Delta (Perimeter Ridge)',
    isCrossCamera: false,
    riskScore: 52,
    maxRisk: 100,
    riskLevel: 'MEDIUM',
    riskBreakdown: [
      { factor: 'Boundary ridge pedestrian detection', weight: '+25' },
      { factor: 'Intermediate distance (80m)', weight: '+15' },
      { factor: 'Single sensor acquisition', weight: '+12' }
    ],
    aiExplanation: 'Solitary individual walking along high ridge path outside primary exclusion fence. Tracking active; no breach trajectory indicated.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-04',
        name: 'Perimeter Ridge',
        sector: 'Sector Delta',
        img: '/cctv/cam4.jpg',
        video: '/videos/camera4.mp4',
        label: 'PERSON 82%',
        model: 'YOLOv8 ACTIVE',
        time: '20:06:45',
        badge: 'RIDGE SCAN',
        note: 'High Ridge Patrol Path'
      }
    ],
    timeline: [
      {
        time: '20:06:45',
        source: 'CAM-04',
        title: 'Person detected on ridge',
        desc: 'Target P-07 acquired at 80m range.',
        confidence: '82%',
        badge: 'NORMAL'
      }
    ],
    auditLog: [
      { time: '20:06:45', action: 'ALERT GENERATED', by: 'YOLOv8', status: 'ACTIVE' },
      { time: '20:08:10', action: 'ACKNOWLEDGED', by: 'Commander R. K. Sharma', status: 'ACKNOWLEDGED' }
    ]
  },

  // 9. MEDIUM ALERT: UNRECOGNIZED VEHICLE SLOW DOWN
  {
    id: 'A-0229',
    alertNumber: 'ALERT #A-0229',
    title: 'Vehicle Anomalous Deceleration at Road Spur',
    severity: 'MEDIUM',
    eventType: 'Vehicle Detection',
    camera: 'CAM-02',
    primaryCam: 'CAM-02',
    camerasList: ['CAM-02'],
    time: '20:03:10',
    date: '28 Sep 2026',
    confidence: '86%',
    rawConfidence: 0.86,
    visibility: 'NORMAL',
    reducedConfidence: false,
    situation: 'CAM-02',
    status: 'ACTIVE',
    targetTrackId: 'Vehicle V-07',
    targetClass: 'Vehicle',
    sector: 'Sector Bravo (Transit Roadway)',
    isCrossCamera: false,
    riskScore: 54,
    maxRisk: 100,
    riskLevel: 'MEDIUM',
    riskBreakdown: [
      { factor: 'Vehicle stopped on unlit shoulder', weight: '+25' },
      { factor: 'Lights extinguished for 12 seconds', weight: '+18' },
      { factor: 'Proximity to Sector Bravo boundary', weight: '+11' }
    ],
    aiExplanation: 'Vehicle V-07 pulled over onto service track shoulder and dimmed headlights. Monitoring continues.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-02',
        name: 'Check Post',
        sector: 'Sector Bravo',
        img: '/cctv/cam2.jpg',
        video: '/videos/camera2.mp4',
        label: 'VEHICLE 86%',
        model: 'YOLOv8 ACTIVE',
        time: '20:03:10',
        badge: 'SHOULDER STOP',
        note: 'Service track deceleration'
      }
    ],
    timeline: [
      {
        time: '20:03:10',
        source: 'CAM-02',
        title: 'Vehicle stopped on shoulder',
        desc: 'Speed zeroed on roadway perimeter.',
        confidence: '86%',
        badge: 'ACTIVE'
      }
    ],
    auditLog: [
      { time: '20:03:10', action: 'SHOULDER DWELL ALERT', by: 'Radar Engine', status: 'ACTIVE' }
    ]
  },

  // 10. MEDIUM ALERT: FOG VISIBILITY DEGRADATION
  {
    id: 'A-0228',
    alertNumber: 'ALERT #A-0228',
    title: 'Fog Onset in Charlie Water Corridor',
    severity: 'MEDIUM',
    eventType: 'Fog / Visibility Warning',
    camera: 'CAM-03',
    primaryCam: 'CAM-03',
    camerasList: ['CAM-03'],
    time: '20:00:45',
    date: '28 Sep 2026',
    confidence: '68%',
    rawConfidence: 0.68,
    visibility: 'MODERATE FOG',
    reducedConfidence: true,
    reducedConfidenceNote: 'Detection accuracy slightly reduced due to river mist. Night & fog enhancement filter turned on.',
    situation: 'CAM-03',
    status: 'ACTIVE',
    targetTrackId: '—',
    targetClass: 'Atmospheric Warning',
    sector: 'Sector Charlie (River Side)',
    isCrossCamera: false,
    riskScore: 49,
    maxRisk: 100,
    riskLevel: 'MEDIUM',
    riskBreakdown: [
      { factor: 'Fog density threshold exceeded (>60%)', weight: '+25' },
      { factor: 'Effective optical range reduced to 75m', weight: '+15' },
      { factor: 'Waterway transit vulnerability', weight: '+09' }
    ],
    aiExplanation: 'Atmospheric sensors logged sudden fog bank rolling in from river channel. Contrast enhancement automatically engaged on CAM-03.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-03',
        name: 'River Side',
        sector: 'Sector Charlie',
        img: '/cctv/cam3.jpg',
        video: '/videos/camera3.mp4',
        label: 'FOG 68%',
        model: 'FOG VISION FILTER',
        time: '20:00:45',
        badge: 'FILTER ACTIVE',
        note: 'River depression visibility reduction'
      }
    ],
    timeline: [
      {
        time: '20:00:45',
        source: 'CAM-03',
        title: 'Fog bank entered sector',
        desc: 'Night and fog vision filter turned on automatically.',
        confidence: '68%',
        badge: 'DEHAZE'
      }
    ],
    auditLog: [
      { time: '20:00:45', action: 'WEATHER ADVISORY', by: 'Atmospheric Module', status: 'ACTIVE' }
    ]
  },

  // 11. MEDIUM ALERT: FENCE SHAKE / VIBRATION SYNC
  {
    id: 'A-0226',
    alertNumber: 'ALERT #A-0226',
    title: 'Fence Vibration Correlated with Visual Scan',
    severity: 'MEDIUM',
    eventType: 'Suspicious Movement Pattern',
    camera: 'CAM-05',
    primaryCam: 'CAM-05',
    camerasList: ['CAM-05'],
    time: '19:54:12',
    date: '28 Sep 2026',
    confidence: '81%',
    rawConfidence: 0.81,
    visibility: 'NORMAL',
    reducedConfidence: false,
    situation: 'CAM-05',
    status: 'ACTIVE',
    targetTrackId: 'Person P-06',
    targetClass: 'Person',
    sector: 'Sector Echo (Eastern Fence)',
    isCrossCamera: false,
    riskScore: 56,
    maxRisk: 100,
    riskLevel: 'MEDIUM',
    riskBreakdown: [
      { factor: 'Fence boundary road movement', weight: '+24' },
      { factor: 'Physical fence contact motion flagged', weight: '+18' },
      { factor: 'Intermediate optical confidence (81%)', weight: '+14' }
    ],
    aiExplanation: 'Visual tracking detected individual brushing against boundary razor wire. Physical sensor corroborated 3.2 Hz fence vibration.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-05',
        name: 'Eastern Fence',
        sector: 'Sector Echo',
        img: '/cctv/cam5.jpg',
        video: '/videos/camera5.mp4',
        label: 'PERSON 81%',
        model: 'YOLOv8 ACTIVE',
        time: '19:54:12',
        badge: 'BOUNDARY WIRE',
        note: 'Eastern Boundary Road'
      }
    ],
    timeline: [
      {
        time: '19:54:12',
        source: 'CAM-05',
        title: 'Fence interaction recorded',
        desc: 'Visual & acoustic correlation confirmed.',
        confidence: '81%',
        badge: 'VIBRATION'
      }
    ],
    auditLog: [
      { time: '19:54:12', action: 'CONTACT FLAG', by: 'Acoustic-Vision Engine', status: 'ACTIVE' }
    ]
  },

  // 12. MEDIUM ALERT: PERIMETER CORRIDOR FOOTSTEP ECHO
  {
    id: 'A-0224',
    alertNumber: 'ALERT #A-0224',
    title: 'Fast Transit Across Gate Buffer Zone',
    severity: 'MEDIUM',
    eventType: 'Restricted Zone Entry',
    camera: 'CAM-06',
    primaryCam: 'CAM-06',
    camerasList: ['CAM-06'],
    time: '19:50:30',
    date: '28 Sep 2026',
    confidence: '79%',
    rawConfidence: 0.79,
    visibility: 'LOW-LIGHT',
    reducedConfidence: true,
    reducedConfidenceNote: 'Detection confidence (79%) reduced due to night shadows at gate.',
    situation: 'CAM-06',
    status: 'ACTIVE',
    targetTrackId: 'Person P-05',
    targetClass: 'Person',
    sector: 'Sector Foxtrot (Sector Gate)',
    isCrossCamera: false,
    riskScore: 55,
    maxRisk: 100,
    riskLevel: 'MEDIUM',
    riskBreakdown: [
      { factor: 'Gate approach speed > 2.0 m/s', weight: '+25' },
      { factor: 'Low-light transit corridor', weight: '+18' },
      { factor: 'Restricted approach radius', weight: '+12' }
    ],
    aiExplanation: 'Subject sprinted across outer gate apron before disappearing behind sentry revetment wall.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-06',
        name: 'Sector Gate',
        sector: 'Sector Foxtrot',
        img: '/cctv/cam6.jpg',
        video: '/videos/camera6.mp4',
        label: 'PERSON 79%',
        model: 'CLAHE ENHANCED',
        time: '19:50:30',
        badge: 'SPEED SPIKE',
        note: 'Gate apron sprint detection'
      }
    ],
    timeline: [
      {
        time: '19:50:30',
        source: 'CAM-06',
        title: 'Sprint velocity detected',
        desc: 'Target velocity 2.4 m/s.',
        confidence: '79%',
        badge: 'ACTIVE'
      }
    ],
    auditLog: [
      { time: '19:50:30', action: 'APRON INTRUSION', by: 'Velocity Tracker', status: 'ACTIVE' }
    ]
  },

  // 13. MEDIUM ALERT: OCCLUSION RE-ID ON CAM-01
  {
    id: 'A-0222',
    alertNumber: 'ALERT #A-0222',
    title: 'Same-Camera Occlusion Re-Identification',
    severity: 'MEDIUM',
    eventType: 'Person Detection',
    camera: 'CAM-01',
    primaryCam: 'CAM-01',
    camerasList: ['CAM-01'],
    time: '19:48:15',
    date: '28 Sep 2026',
    confidence: '92%',
    rawConfidence: 0.92,
    visibility: 'NORMAL',
    reducedConfidence: false,
    situation: 'SITUATION #024',
    status: 'ACTIVE',
    targetTrackId: 'Person P-12',
    targetClass: 'Person',
    sector: 'Sector Alpha',
    isCrossCamera: false,
    riskScore: 62,
    maxRisk: 100,
    riskLevel: 'MEDIUM',
    riskBreakdown: [
      { factor: 'Subject emerged after 4.2s culvert occlusion', weight: '+28' },
      { factor: 'ByteTrack Kalman state trajectory matched', weight: '+22' },
      { factor: 'Known suspicious track continuity', weight: '+12' }
    ],
    aiExplanation: 'Target was obscured behind drainage ditch revetment for 4.2 seconds. ByteTrack Kalman filter maintained kinematic state and successfully re-associated Track #P-12 with 92% confidence upon standing.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-01',
        name: 'North Border',
        sector: 'Sector Alpha',
        img: '/cctv/cam1.jpg',
        video: '/videos/camera1.mp4',
        label: 'PERSON 92%',
        model: 'YOLOv8 ACTIVE',
        time: '19:48:15',
        badge: 'KALMAN RE-ID',
        note: 'Occlusion recovery success'
      }
    ],
    timeline: [
      {
        time: '19:48:10',
        source: 'CAM-01',
        title: 'Target obscured behind ditch',
        desc: 'Kalman filter maintained state prediction.',
        confidence: '—',
        badge: 'OCCLUDED'
      },
      {
        time: '19:48:15',
        source: 'CAM-01',
        title: 'Re-identification confirmed',
        desc: 'Track #P-12 restored without ID fragmentation.',
        confidence: '92%',
        badge: 'RE-ASSOCIATED'
      }
    ],
    auditLog: [
      { time: '19:48:15', action: 'TRACK RE-ASSOCIATION', by: 'ByteTrack Engine', status: 'ACTIVE' }
    ]
  },

  // 14. LOW ALERT: CAMERA HEALTH DEGRADATION
  {
    id: 'A-0227',
    alertNumber: 'ALERT #A-0227',
    title: 'Camera Health Degradation (Signal & FPS Drop)',
    severity: 'LOW',
    eventType: 'Camera Health Warning',
    camera: 'CAM-05',
    primaryCam: 'CAM-05',
    camerasList: ['CAM-05'],
    time: '19:58:21',
    date: '28 Sep 2026',
    confidence: '—',
    rawConfidence: null,
    visibility: 'DEGRADED',
    reducedConfidence: false,
    situation: '—',
    status: 'ACKNOWLEDGED',
    targetTrackId: '—',
    targetClass: 'Sensor Diagnostic',
    sector: 'Sector Echo (Eastern Fence)',
    isCrossCamera: false,
    isCameraHealthAlert: true,
    healthMetrics: {
      signal: 'Signal Degraded',
      brightness: '18%',
      visibility: 'LOW',
      fps: 22,
      status: 'WARNING',
      latencyMs: '340ms',
      hardwareTemp: '48°C'
    },
    riskScore: 28,
    maxRisk: 100,
    riskLevel: 'LOW',
    riskBreakdown: [
      { factor: 'Frame rate jitter (Dropped from 30 to 22 FPS)', weight: '+12' },
      { factor: 'Luminance attenuation (18% brightness)', weight: '+10' },
      { factor: 'Hardware watchdog ping delay (+320ms)', weight: '+06' }
    ],
    aiExplanation: 'Optical stream on CAM-05 experienced bandwidth throttling and lens moisture buildup. Sensor health downgraded to WARNING status. Secondary sensor coverage active via CAM-03.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-05',
        name: 'Eastern Fence',
        sector: 'Sector Echo',
        img: '/cctv/cam5.jpg',
        video: '/videos/camera5.mp4',
        label: 'WARNING: 22 FPS',
        model: 'DIAGNOSTIC ACTIVE',
        time: '19:58:21',
        badge: 'HARDWARE WARNING',
        note: 'Bandwidth jitter and low contrast'
      }
    ],
    timeline: [
      {
        time: '19:57:10',
        source: 'DIAGNOSTIC DAEMON',
        title: 'FPS variance detected',
        desc: 'FPS slipped to 22 FPS.',
        confidence: '—',
        badge: 'SYSTEM'
      },
      {
        time: '19:58:21',
        source: 'CAM-05',
        title: 'Health degradation warning logged',
        desc: 'Automatic diagnostics dispatched to technician console.',
        confidence: '—',
        badge: 'WARNING'
      }
    ],
    auditLog: [
      { time: '19:58:21', action: 'HARDWARE WARNING', by: 'Health Watchdog', status: 'ACKNOWLEDGED' }
    ]
  },

  // 15. LOW ALERT: ROUTINE SYSTEM SELF-CHECK
  {
    id: 'A-0221',
    alertNumber: 'ALERT #A-0221',
    title: 'Routine YOLOv8 Inference Heartbeat Nominal',
    severity: 'LOW',
    eventType: 'System Detection Error',
    camera: 'CAM-01',
    primaryCam: 'CAM-01',
    camerasList: ['CAM-01'],
    time: '19:40:00',
    date: '28 Sep 2026',
    confidence: '99%',
    rawConfidence: 0.99,
    visibility: 'NOMINAL',
    reducedConfidence: false,
    situation: '—',
    status: 'ACKNOWLEDGED',
    targetTrackId: 'System Diagnostic',
    targetClass: 'System Process',
    sector: 'All Sectors',
    isCrossCamera: false,
    riskScore: 12,
    maxRisk: 100,
    riskLevel: 'LOW',
    riskBreakdown: [
      { factor: 'Routine operational watchdog ping', weight: '+12' }
    ],
    aiExplanation: 'Automated 1-hour diagnostic cycle confirmed all 6 CCTV streams delivering nominal video frames with zero dropped packets.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-01',
        name: 'North Border',
        sector: 'Sector Alpha',
        img: '/cctv/cam1.jpg',
        video: '/videos/camera1.mp4',
        label: 'HEARTBEAT 99%',
        model: 'YOLOv8 ACTIVE',
        time: '19:40:00',
        badge: 'DIAGNOSTIC OK',
        note: 'System operational integrity verified'
      }
    ],
    timeline: [
      {
        time: '19:40:00',
        source: 'WATCHDOG',
        title: 'Heartbeat ping successful',
        desc: 'System health verified 100%.',
        confidence: '99%',
        badge: 'NOMINAL'
      }
    ],
    auditLog: [
      { time: '19:40:00', action: 'SYSTEM HEARTBEAT', by: 'System Engine', status: 'ACKNOWLEDGED' }
    ]
  },

  // 16. RESOLVED ALERT: DENSE FOG PENETRATION VERIFIED
  {
    id: 'A-0225',
    alertNumber: 'ALERT #A-0225',
    title: 'Dense Fog / Visibility Warning (Residual 24%)',
    severity: 'MEDIUM',
    eventType: 'Fog / Visibility Warning',
    camera: 'CAM-03',
    primaryCam: 'CAM-03',
    camerasList: ['CAM-03'],
    time: '19:45:10',
    date: '28 Sep 2026',
    confidence: '61%',
    rawConfidence: 0.61,
    visibility: 'DENSE FOG (CONTRAST 5.2)',
    reducedConfidence: true,
    reducedConfidenceNote: 'Detection confidence reduced (61%) due to dense seasonal river fog. OpenCV CLAHE module restored visibility from 45m to ~160m.',
    situation: 'SITUATION #021',
    status: 'RESOLVED',
    targetTrackId: 'Person P-03',
    targetClass: 'Person',
    sector: 'Sector Charlie (River Side)',
    isCrossCamera: false,
    riskScore: 48,
    maxRisk: 100,
    riskLevel: 'MEDIUM',
    riskBreakdown: [
      { factor: 'Dense river mist obstruction (>75% fog)', weight: '+22' },
      { factor: 'Perimeter movement in fog corridor', weight: '+18' },
      { factor: 'Restored confidence margin', weight: '+08' }
    ],
    aiExplanation: 'Heavy winter river fog reduced raw optical contrast to 5.2. Autonomous CLAHE dehazing engine engaged to maintain ByteTrack continuity.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-03',
        name: 'River Side',
        sector: 'Sector Charlie',
        img: '/cctv/cam3.jpg',
        video: '/videos/camera3.mp4',
        label: 'PERSON 61%',
        model: 'CLAHE DEHAZE',
        time: '19:45:10',
        badge: 'FOG PENETRATION',
        note: 'Dense fog penetration mode active'
      }
    ],
    timeline: [
      {
        time: '19:44:12',
        source: 'CAM-03',
        title: 'Fog density sensor triggered',
        desc: 'Contrast dropped to 5.2; dehazing engaged.',
        confidence: '—',
        badge: 'QUALITY ENGINE'
      },
      {
        time: '19:45:10',
        source: 'CAM-03',
        title: 'Target tracked in fog',
        desc: 'Track #P-03 maintained with 61% confidence.',
        confidence: '61%',
        badge: 'ENHANCED'
      },
      {
        time: '19:55:00',
        source: 'OPERATOR',
        title: 'Patrol inspected waterline',
        desc: 'No breach found; stray wildlife movement confirmed.',
        confidence: '—',
        badge: 'RESOLVED'
      }
    ],
    auditLog: [
      { time: '19:45:10', action: 'FOG ALERT', by: 'Weather Module', status: 'ACTIVE' },
      { time: '19:55:00', action: 'RESOLVED', by: 'Commander R. K. Sharma', status: 'RESOLVED' }
    ]
  },

  // 17. RESOLVED ALERT: MULTI-PERSON PERMIT VALIDATION
  {
    id: 'A-0220',
    alertNumber: 'ALERT #A-0220',
    title: 'Multiple Person Detection (2 Targets P-04, P-05)',
    severity: 'HIGH',
    eventType: 'Multiple Person Detection',
    camera: 'CAM-04',
    primaryCam: 'CAM-04',
    camerasList: ['CAM-04'],
    time: '19:30:15',
    date: '28 Sep 2026',
    confidence: '88%',
    rawConfidence: 0.88,
    visibility: 'NORMAL',
    reducedConfidence: false,
    situation: 'SITUATION #020',
    status: 'RESOLVED',
    targetTrackId: 'P-04, P-05',
    targetClass: 'Person',
    sector: 'Sector Delta (Perimeter Ridge)',
    isCrossCamera: false,
    riskScore: 72,
    maxRisk: 100,
    riskLevel: 'HIGH',
    riskBreakdown: [
      { factor: 'Group movement (2 subjects)', weight: '+30' },
      { factor: 'Off-trail traversal on perimeter ridge', weight: '+25' },
      { factor: 'High optical confidence (88%)', weight: '+17' }
    ],
    aiExplanation: 'Two individuals detected walking in close proximity along the ridge slope. Sentry patrol confirmed border maintenance team with clearance permit #MHA-7729.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-04',
        name: 'Perimeter Ridge',
        sector: 'Sector Delta',
        img: '/cctv/cam4.jpg',
        video: '/videos/camera4.mp4',
        label: '2 PERSONS 88%',
        model: 'YOLOv8 ACTIVE',
        time: '19:30:15',
        badge: 'GROUP DETECT',
        note: 'Multiple targets acquired'
      }
    ],
    timeline: [
      {
        time: '19:30:15',
        source: 'CAM-04',
        title: '2 Persons detected',
        desc: 'ByteTrack tracks #04 & #05 assigned.',
        confidence: '88%',
        badge: 'GROUP'
      },
      {
        time: '19:35:00',
        source: 'QRT ALPHA',
        title: 'Identity verified',
        desc: 'Permit #MHA-7729 validated by sentry post.',
        confidence: '—',
        badge: 'RESOLVED'
      }
    ],
    auditLog: [
      { time: '19:30:15', action: 'GROUP ALERT', by: 'YOLOv8 Multi-Track', status: 'ACTIVE' },
      { time: '19:35:00', action: 'RESOLVED', by: 'Commander R. K. Sharma', status: 'RESOLVED' }
    ]
  },

  // 18. RESOLVED ALERT: ROUTINE PATROL HANDSHAKE
  {
    id: 'A-0215',
    alertNumber: 'ALERT #A-0215',
    title: 'Perimeter Patrol Routine Handshake',
    severity: 'LOW',
    eventType: 'Person Detection',
    camera: 'CAM-02',
    primaryCam: 'CAM-02',
    camerasList: ['CAM-02'],
    time: '19:15:00',
    date: '28 Sep 2026',
    confidence: '96%',
    rawConfidence: 0.96,
    visibility: 'NORMAL',
    reducedConfidence: false,
    situation: '—',
    status: 'RESOLVED',
    targetTrackId: 'Patrol Unit 2',
    targetClass: 'Person',
    sector: 'Sector Bravo (Check Post)',
    isCrossCamera: false,
    riskScore: 15,
    maxRisk: 100,
    riskLevel: 'LOW',
    riskBreakdown: [
      { factor: 'Scheduled friendly patrol presence', weight: '+10' },
      { factor: 'RFID badge verified', weight: '+05' }
    ],
    aiExplanation: 'Scheduled BSF sentry patrol passed Check Post camera. Standard checkpoint handshake logged.',
    evidenceThumbnails: [
      {
        camCode: 'CAM-02',
        name: 'Check Post',
        sector: 'Sector Bravo',
        img: '/cctv/cam2.jpg',
        video: '/videos/camera2.mp4',
        label: 'PATROL 96%',
        model: 'YOLOv8 ACTIVE',
        time: '19:15:00',
        badge: 'AUTHORIZED',
        note: 'Authorized Patrol Unit'
      }
    ],
    timeline: [
      {
        time: '19:15:00',
        source: 'CAM-02',
        title: 'Patrol unit acquired',
        desc: 'Automated badge match confirmed friendly.',
        confidence: '96%',
        badge: 'AUTHORIZED'
      }
    ],
    auditLog: [
      { time: '19:15:00', action: 'ROUTINE CHECK', by: 'Access Control', status: 'RESOLVED' }
    ]
  }
];

// SIMULATION TEMPLATES FOR DYNAMIC "SIMULATE DETECTION"
export const SIMULATION_TEMPLATES = [
  {
    title: 'Person Detected Near Restricted Perimeter',
    severity: 'HIGH',
    eventType: 'Restricted Zone Entry',
    camera: 'CAM-04',
    camerasList: ['CAM-04'],
    confidence: '89%',
    rawConfidence: 0.89,
    visibility: 'NORMAL',
    reducedConfidence: false,
    situation: 'SITUATION #025',
    targetTrackId: 'Person P-16',
    targetClass: 'Person',
    sector: 'Sector Delta (Perimeter Ridge)',
    isCrossCamera: false,
    riskScore: 81,
    riskLevel: 'HIGH',
    riskBreakdown: [
      { factor: 'Perimeter razor-wire proximity (<8m)', weight: '+32' },
      { factor: 'High optical confidence (89%)', weight: '+25' },
      { factor: 'Off-trail slope traversal', weight: '+24' }
    ],
    aiExplanation: 'Unidentified subject detected moving along outer ridge boundary toward unlit perimeter post.',
    note: 'Ridge buffer zone movement detected.'
  },
  {
    title: 'Cross-Camera Movement Detected',
    severity: 'HIGH',
    eventType: 'Cross-Camera Movement',
    camera: 'CAM-01 → CAM-02',
    camerasList: ['CAM-01', 'CAM-02'],
    confidence: '88%',
    rawConfidence: 0.88,
    visibility: 'NORMAL',
    reducedConfidence: false,
    situation: 'SITUATION #026',
    targetTrackId: 'Person P-18',
    targetClass: 'Person',
    sector: 'Sector Alpha → Sector Bravo',
    isCrossCamera: true,
    corridorName: 'North Ridge Road to Check Post Bypass',
    riskScore: 79,
    riskLevel: 'HIGH',
    riskBreakdown: [
      { factor: 'Rapid transit across 2 monitored sectors (48s)', weight: '+30' },
      { factor: 'Direct checkpoint avoidance vector', weight: '+27' },
      { factor: 'Consistent Kalman velocity matching (1.4 m/s)', weight: '+22' }
    ],
    aiExplanation: 'Related movement pattern detected across CAM-01 and CAM-02 within 48 seconds without face recognition.',
    note: 'Sequential cross-camera transit.'
  },
  {
    title: 'Vehicle Detected in Restricted Zone',
    severity: 'HIGH',
    eventType: 'Vehicle Detection',
    camera: 'CAM-02',
    camerasList: ['CAM-02'],
    confidence: '92%',
    rawConfidence: 0.92,
    visibility: 'NORMAL',
    reducedConfidence: false,
    situation: 'SITUATION #027',
    targetTrackId: 'Vehicle V-11',
    targetClass: 'Vehicle',
    sector: 'Sector Bravo (Transit Gate)',
    isCrossCamera: false,
    riskScore: 78,
    riskLevel: 'HIGH',
    riskBreakdown: [
      { factor: 'Unauthorized motor vehicle in border service lane', weight: '+35' },
      { factor: 'Speed exceeding 30 km/h in restricted area', weight: '+25' },
      { factor: 'High optical confidence (92%)', weight: '+18' }
    ],
    aiExplanation: 'Light utility vehicle approached northern gate barrier without recognized RFID dispatch permit.',
    note: 'Service road unauthorized transit.'
  },
  {
    title: 'Dense Fog / Low-Visibility Degradation Alert',
    severity: 'MEDIUM',
    eventType: 'Fog / Visibility Warning',
    camera: 'CAM-03',
    camerasList: ['CAM-03'],
    confidence: '64%',
    rawConfidence: 0.64,
    visibility: 'DENSE FOG (CONTRAST 6.8)',
    reducedConfidence: true,
    reducedConfidenceNote: 'Detection confidence reduced (64%) due to sudden dense river fog. CLAHE filter active.',
    situation: 'CAM-03',
    targetTrackId: 'Person P-21',
    targetClass: 'Person',
    sector: 'Sector Charlie (River Side)',
    isCrossCamera: false,
    riskScore: 57,
    riskLevel: 'MEDIUM',
    riskBreakdown: [
      { factor: 'Dense river fog visibility reduction', weight: '+26' },
      { factor: 'Target moving in river depression', weight: '+20' },
      { factor: 'Restored confidence after CLAHE', weight: '+11' }
    ],
    aiExplanation: 'River mist reduced contrast to 6.8. System engaged CLAHE enhancement and notified operator of visibility limitation.',
    note: 'Automated fog dehazing active.'
  },
  {
    title: 'Razor-Wire Barrier Tampering Motion',
    severity: 'CRITICAL',
    eventType: 'Restricted Zone Entry',
    camera: 'CAM-05',
    camerasList: ['CAM-05'],
    confidence: '93%',
    rawConfidence: 0.93,
    visibility: 'NORMAL',
    reducedConfidence: false,
    situation: 'SITUATION #028',
    targetTrackId: 'Person P-22',
    targetClass: 'Person',
    sector: 'Sector Echo (Eastern Fence)',
    isCrossCamera: false,
    riskScore: 92,
    riskLevel: 'CRITICAL',
    riskBreakdown: [
      { factor: 'Direct wire contact and prolonged crouch posture', weight: '+40' },
      { factor: 'Zero Line proximity marker breach', weight: '+30' },
      { factor: 'High optical confidence (93%)', weight: '+22' }
    ],
    aiExplanation: 'Subject crouched within 1 meter of razor-wire anchor point on CAM-05. Immediate tactical dispatch recommended.',
    note: 'Fence tampering detected.'
  },
  {
    title: 'Camera Sensor Health Degradation',
    severity: 'LOW',
    eventType: 'Camera Health Warning',
    camera: 'CAM-06',
    camerasList: ['CAM-06'],
    confidence: '—',
    rawConfidence: null,
    visibility: 'DEGRADED',
    reducedConfidence: false,
    situation: '—',
    targetTrackId: '—',
    targetClass: 'Sensor Diagnostic',
    sector: 'Sector Foxtrot',
    isCrossCamera: false,
    isCameraHealthAlert: true,
    healthMetrics: {
      signal: 'Signal Degraded',
      brightness: '18%',
      visibility: 'LOW',
      fps: 22,
      status: 'WARNING',
      latencyMs: '310ms'
    },
    riskScore: 24,
    riskLevel: 'LOW',
    riskBreakdown: [
      { factor: 'Packet drop on CCTV fiber trunk', weight: '+14' },
      { factor: 'Lens brightness attenuation', weight: '+10' }
    ],
    aiExplanation: 'CAM-06 logged frame rate drop to 22 FPS and low illumination. Sensor maintenance ticket created.',
    note: 'Camera health warning.'
  }
];
