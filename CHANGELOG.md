# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [1.0.0-beta.5] - 2020-03-30

### Added

- The TD select input now has keyboard support.

## [1.0.0-beta.4] - 2020-03-21

### Added

- Attendance data for members of the 32nd Dáil for January 2020 was added.

### Changed

- Attendance data files are reformatted to be more human-readable and more similar to the published attendance reports.
- Number of sitting days in each attendance report period is no longer hard-coded and is now part of attendance data files.

### Removed

- Mention of semantic versioning is removed because this project is not a dependency of another project, therefore semantic versioning is not really relevant.

### Security

- Packages are updated based on npm audit.

## [1.0.0-beta.3] - 2020-03-10

### Added

- Disclaimer on the 120 days cap on reported attendance.
- Link to the source attendance records.

### Changed

- More consistent terminology (for example, "vote" instead of "division") across the UI and code.

## [1.0.0-beta.2] - 2020-03-08

### Added

- We can now view data on the 33rd Dáil!
- Attendance data for December 2019 was added.
- Permissive licence statements were added for both code and data.

### Changed

- The calendar is now in reverse chronological order (most recent month first) and no future months are shown.
- Options for selecting a TD are now loaded asynchronously so the app bundle size is reduced.

## [1.0.0-beta.1] - 2020-02-27

### Changed

- Attendance data files are moved to a directory specific to the house number and the year.

## [1.0.0-beta.0] - 2020-02-19

### Added

- TD debates and votes data from the [Houses of the Oireachtas Open Data APIs](https://api.oireachtas.ie/).
- TD attendance data for the 32nd Dáil in 2019.
- Basic data visualisations for votes and attendance.
- Activity calendar.
- Data entry mode for attendance.

[unreleased]: https://github.com/tewson/td-tracker/compare/v1.0.0-beta.5...HEAD
[1.0.0-beta.5]: https://github.com/tewson/td-tracker/releases/tag/v1.0.0-beta.5
[1.0.0-beta.4]: https://github.com/tewson/td-tracker/releases/tag/v1.0.0-beta.4
[1.0.0-beta.3]: https://github.com/tewson/td-tracker/releases/tag/v1.0.0-beta.3
[1.0.0-beta.2]: https://github.com/tewson/td-tracker/releases/tag/v1.0.0-beta.2
[1.0.0-beta.1]: https://github.com/tewson/td-tracker/releases/tag/v1.0.0-beta.1
[1.0.0-beta.0]: https://github.com/tewson/td-tracker/releases/tag/v1.0.0-beta.0
