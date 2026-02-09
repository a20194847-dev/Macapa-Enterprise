#!/usr/bin/env python3
"""
Master script to run all data collection and analysis for MACAPA
Ejecuta: fetch_arxiv, analyze_repos, validate outputs
"""

import subprocess
import sys
import os
from datetime import datetime

def run_script(script_path, args=None):
    """Execute a Python script and capture output"""
    cmd = [sys.executable, script_path]
    if args:
        cmd.extend(args)
    
    print(f"\n{'='*60}")
    print(f"Running: {script_path}")
    print(f"{'='*60}\n")
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        print(f"⚠️  Timeout: {script_path} took too long (>30s)")
        return False
    except Exception as e:
        print(f"⚠️  Error running {script_path}: {e}")
        return False

def check_files():
    """Check if output files were created"""
    import json
    
    files_to_check = [
        'analysis/arxiv_ml_20.json',
        'analysis/repos_analysis.json'
    ]
    
    print("\n" + "="*60)
    print("CHECKING OUTPUT FILES")
    print("="*60 + "\n")
    
    for filepath in files_to_check:
        try:
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                print(f"✓ {filepath} ({len(data)} items)")
            else:
                print(f"✗ {filepath} NOT FOUND")
        except Exception as e:
            print(f"✗ {filepath} - Error: {e}")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    print("╔" + "="*58 + "╗")
    print("║" + " "*15 + "MACAPA Data Collection Suite" + " "*15 + "║")
    print("╚" + "="*58 + "╝")
    print(f"\nStarted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    # 1. Fetch arXiv data
    print("\n[1/3] Fetching arXiv data...")
    arxiv_success = run_script('fetch_arxiv.py', [
        '--query', 'machine learning artificial intelligence deep learning',
        '--max_results', '20',
        '--out', 'analysis/arxiv_ml_20.json'
    ])
    
    # 2. Analyze repos
    print("\n[2/3] Analyzing GitHub repositories...")
    repos_success = run_script('analyze_repos.py')
    
    # 3. Check generated files
    check_files()
    
    # 4. Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    if arxiv_success:
        print("✓ arXiv data fetched successfully")
    else:
        print("⚠️  arXiv fetch had issues (may be rate-limited)")
    
    if repos_success:
        print("✓ Repository analysis completed")
    else:
        print("⚠️  Repository analysis had issues")
    
    print("\n📁 Output files location:")
    print("  - tools/analysis/arxiv_ml_20.json")
    print("  - tools/analysis/repos_analysis.json")
    print("\n📝 Next steps:")
    print("  1. View the JSON files to see data structure")
    print("  2. Integrate data into MACAPA backend")
    print("  3. Create API endpoints to serve data")

if __name__ == '__main__':
    main()
