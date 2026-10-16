# Proposed zVEM workflow additions

A local, interactive system demonstration, not a replacement portal. All records are fictional and no healthcare services are connected.

## Open the demo

- `../patient.html` opens the patient version.
- `../doctor.html` opens the separate doctor workspace.
- `../nurse.html` opens the separate nurse workspace.
- All three use `../allnighter.html`, with `#patient`, `#doctor` or `#nurse` selecting the workspace. Opening the same underlying file in three tabs allows browser-local state to be shared where localStorage is available.
- For HTTP preview, run `npm run dev` and open `http://localhost:5173/` with the appropriate role hash.

The patient version starts with a login form. Enter the fictional ZZZS number and randomly generated password shown under **Demo access details**, then select **Log in**. The inputs are confined to this login step; the care workflow still uses large choices without typing. **Log out** beside the patient's name returns to the form while keeping demo records, and **Reset demo** creates new demo credentials. This is a visual workflow example, not a real identity check or secure account system.

## Demonstrate a complete workflow

1. Patient: choose **Blood or urine test**, select one or both tests, choose laboratory or home collection, and submit.
2. Doctor: select the incoming test request. Review the attached Passport and approve the request or ask for a consultation first.
3. Patient: the result appears under **Your requests**. An approved laboratory request offers times that can be booked.
4. Nurse: the booked laboratory collection appears automatically. Record each examination step, including sample collection, and complete the record.
5. Doctor: select the patient's request under **Completed** to see the shared nurse record, with completion names and timestamps.

The guided questionnaire branches according to urgency, concern and selected symptoms, with no typed answers. The receiving queue is assigned automatically; the doctor does not choose between doctor and nurse. The routing rules are illustrative, not clinically validated. Clinical decisions remain a professional responsibility. Administrative requests appear in the nurse workspace.

The Passport shows medications, allergies, conditions and past operations. In either staff workspace, select a medicine to see its ingredient, strength, prescription issue status, issue date, treatment start/end timeline, precautions, and examples of interacting medicines linked to NHS references. Ongoing treatment has no invented end date. These examples are not a complete interaction checker, and treatment dates do not establish that doses were taken. The Ibuprofen example starts as **Not issued**; the doctor can review and mark it issued in the demo to demonstrate the shared update.

Nurses record examination steps with large **Done** / **Not applicable** buttons. Required steps cannot be skipped, and sample collection is required for lab appointments. Each update records the nurse and timestamp, with an undo history. Completing the record makes it read-only and updates the patient request. Doctors can see saved nurse steps immediately. The checklist records workflow completion only, not observation measurements; it is not a clinical protocol.

Appointments can be booked or cancelled directly. Suitable cancelled consultation slots are automatically offered to the next eligible fictional waiting-list patient. Switching to Marija's authorized sample family profile demonstrates accepting an offer. Available slots and the doctor's scheduling activity update together.

Other original proposal flows retained: repeat prescriptions, selected administrative requests, authorized family profile switching, and a simple simulated walk-in check-in ticket. Search, document downloads, generic messaging, task lists, unrelated dashboards and marketing content have been removed.

## Development

No dependencies are required to run the app. Source is in `dist/`. Run `npm run check` for JavaScript syntax checks. Regenerate the standalone file after edits:

```
node scripts/export-standalone.mjs ../allnighter.html
```

This demo stores fictional state in localStorage under `zvem-workflow-demo-v2`. Existing version-2 records are enriched with medication metadata and the nurse workspace without clearing previous activity. Reset demo restores the original records. No patient text fields, real authorizations, prescriptions, shipments, test orders, clinically validated triage, or external messages are implemented. Publication is disabled by the user's local-only instruction.
