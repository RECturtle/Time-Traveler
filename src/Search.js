import React, { useState } from 'react';
import axios from 'axios';
import './Search.css';

const Search = () => {
    const [siteName, setSiteName] = useState('www.google.com');
    const [searchDate, setSearchDate] = useState('');
    const [siteResult, setSiteResult] = useState({});
    const [isValidSearch, setIsValidSearch] = useState(true);
    const [validSite, setValidSite] = useState(true);
    const [newVisit, setNewVisit] = useState(true);

    const queryArchive = async (e) => {
        e.preventDefault();

        if (siteName === '' || searchDate === '') {
            setIsValidSearch(false);
            return;
        }

        setNewVisit(false);

        const res = await axios.get(
            `https://archive.org/wayback/available?url=${siteName}&timestamp=${searchDate}`
        );

        if (Object.keys(res.data.archived_snapshots).length === 0) {
            setValidSite(false);
            setIsValidSearch(true);
            setSiteResult({});
            return;
        }

        setValidSite(true);
        setSiteResult(res.data);
        setIsValidSearch(true);
    };

    const convertTime = (timestamp) => {
        const year = timestamp.slice(0, 4);
        const month = timestamp.slice(4, 6);
        const day = timestamp.slice(6, 8);

        return `Closest Snapshot: ${month}/${day}/${year}`;
    };

    return (
        <div>
            {!isValidSearch && (
                <div className="ui red message">
                    Enter a site url and select a date.
                </div>
            )}
            <div className="search-form">
                <form onSubmit={queryArchive} className="ui form">
                    <div className="two fields">
                        <div className="field">
                            <label>Website URL</label>
                            <input
                                type="text"
                                onChange={(e) => setSiteName(e.target.value)}
                                value={siteName}
                            />
                        </div>
                        <div className="field">
                            <label>Snapshot Date</label>
                            <div className="ui calendar" id="example1">
                                <div className="ui input left icon">
                                    <i className="calendar icon"></i>
                                    <input
                                        type="date"
                                        onChange={(e) =>
                                            setSearchDate(
                                                e.target.value.replaceAll(
                                                    '-',
                                                    ''
                                                )
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <button
                            className="ui button no-label"
                            onClick={queryArchive}
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>

            {!validSite && (
                <div className="ui red message">
                    No archives found. Try another site.
                </div>
            )}

            {newVisit && (
                <div className="ui cards">
                    <div className="card">
                        <div className="content">
                            <div className="header">
                                Welcome to Time Travler
                            </div>
                            <div class="ui fitted divider"></div>
                            <br />
                            <div>
                                <p>
                                    This site uses Wayback Machine's API to
                                    retrieve a snapshot for a url closest to the
                                    date you provide.
                                </p>
                                <br />
                                <p>
                                    Enter a site and date above to get started!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {siteResult.archived_snapshots &&
            Object.keys(siteResult?.archived_snapshots).length !== 0 ? (
                <div className="ui cards">
                    <div className="card">
                        <div className="content">
                            <div className="header">Archive Snapshot Found</div>
                            <p></p>
                            <p>URL: {siteResult.url}</p>
                            <p>
                                {convertTime(
                                    siteResult.archived_snapshots.closest
                                        .timestamp
                                )}
                            </p>
                            <a
                                rel="noreferrer"
                                target="_blank"
                                href={siteResult.archived_snapshots.closest.url}
                            >
                                <div className="ui button">
                                    <i className="add icon"></i>
                                    Visit Site
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Search;
