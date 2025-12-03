#!/usr/bin/env python3
"""
Unit Test Runner for Backend Code (White-Box Testing)
"""
import os
import sys
import subprocess

def run_test(test_file, description):
    """Run a single unit test file"""
    print(f"\n{'='*60}")
    print(f"RUNNING: {description}")
    print(f"{'='*60}")
    
    try:
        # Run the test file
        result = subprocess.run(
            [sys.executable, test_file],
            capture_output=True,
            text=True,
            check=True
        )
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Test failed: {description}")
        print("Output:", e.stdout)
        print("Error:", e.stderr)
        return False

def main():
    """Main test runner"""
    print("=" * 60)
    print("BACKEND UNIT TESTS - WHITE BOX TESTING")
    print("=" * 60)
    
    # Define test files
    test_files = [
        ("tests/unit/test_crud.py", "CRUD Operations Unit Tests"),
        ("tests/unit/test_schema.py", "Schema Validation Unit Tests"),
        ("tests/unit/test_models.py", "Database Models Unit Tests")
    ]
    
    # Run all tests
    passed = 0
    failed = 0
    
    for test_file, description in test_files:
        if os.path.exists(test_file):
            success = run_test(test_file, description)
            if success:
                passed += 1
            else:
                failed += 1
        else:
            print(f"\n❌ Test file not found: {test_file}")
            failed += 1
    
    # Print summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"📊 Total:  {passed + failed}")
    
    if failed == 0:
        print("\n🎉 ALL UNIT TESTS PASSED SUCCESSFULLY!")
    else:
        print(f"\n⚠️  {failed} test(s) failed")
        sys.exit(1)

if __name__ == "__main__":
    main()